import { PrismaClient } from '@prisma/client';
import * as mockDb from './mock-db';

declare global {
  var prisma: PrismaClient | undefined;
}

const isMock = process.env.NEXT_PUBLIC_MOCK_ENV === 'true' || !process.env.DATABASE_URL;

export const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export const isMockEnv = isMock;

const pruneUndefined = (obj: any) => {
  if (!obj) return obj;
  const copy = { ...obj };
  Object.keys(copy).forEach(key => {
    if (copy[key] === undefined) {
      delete copy[key];
    }
  });
  return copy;
};

export const db = {
  isMock,
  prisma,

  // Campuses
  async campusFindMany() {
    if (isMock) {
      return mockDb.getMockDb().campuses;
    }
    return await prisma.campus.findMany({ include: { programs: true } });
  },

  // Programs
  async programFindMany() {
    if (isMock) {
      return mockDb.getMockDb().programs;
    }
    return await prisma.program.findMany({ include: { courses: true, campus: true } });
  },

  // Courses
  async courseFindMany() {
    if (isMock) {
      return mockDb.getMockDb().courses;
    }
    return await prisma.course.findMany({ include: { program: true } });
  },

  // Users
  async userFindMany() {
    if (isMock) {
      return mockDb.getMockDb().users;
    }
    return await prisma.user.findMany();
  },

  async userFindUnique(id: string) {
    if (isMock) {
      return mockDb.getMockDb().users.find(u => u.id === id) || null;
    }
    return await prisma.user.findUnique({ where: { id } });
  },

  async userUpdate(id: string, payload: any) {
    if (isMock) {
      const data = mockDb.getMockDb();
      const idx = data.users.findIndex(u => u.id === id);
      if (idx !== -1) {
        data.users[idx] = { ...data.users[idx], ...pruneUndefined(payload) };
        mockDb.saveMockDb(data);
        return data.users[idx];
      }
      return null;
    }
    return await prisma.user.update({ where: { id }, data: payload });
  },

  // Leads
  async leadFindMany(filters?: { campusId?: string; programId?: string; status?: string; query?: string; counsellorId?: string }) {
    if (isMock) {
      const data = mockDb.getMockDb();
      let list = [...data.leads];

      if (filters?.campusId) {
        list = list.filter(l => l.campusId === filters.campusId);
      }
      if (filters?.programId) {
        list = list.filter(l => l.programId === filters.programId);
      }
      if (filters?.status) {
        list = list.filter(l => l.status === filters.status);
      }
      if (filters?.counsellorId) {
        list = list.filter(l => l.counsellorId === filters.counsellorId);
      }
      if (filters?.query) {
        const q = filters.query.toLowerCase();
        list = list.filter(l =>
          l.studentName.toLowerCase().includes(q) ||
          l.parentName.toLowerCase().includes(q) ||
          l.mobile.includes(q) ||
          l.email.toLowerCase().includes(q)
        );
      }
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const where: any = {};
    if (filters?.campusId) where.campusId = filters.campusId;
    if (filters?.programId) where.programId = filters.programId;
    if (filters?.status) where.status = filters.status;
    if (filters?.counsellorId) where.counsellorId = filters.counsellorId;
    if (filters?.query) {
      where.OR = [
        { studentName: { contains: filters.query, mode: 'insensitive' } },
        { parentName: { contains: filters.query, mode: 'insensitive' } },
        { mobile: { contains: filters.query } },
        { email: { contains: filters.query, mode: 'insensitive' } },
      ];
    }
    return await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { campus: true, program: true, course: true, counsellor: true }
    });
  },

  async leadFindUnique(id: string) {
    if (isMock) {
      const data = mockDb.getMockDb();
      const lead = data.leads.find(l => l.id === id);
      if (!lead) return null;

      const campus = data.campuses.find(c => c.id === lead.campusId);
      const program = data.programs.find(p => p.id === lead.programId);
      const course = data.courses.find(c => c.id === lead.courseId);
      const counsellor = data.users.find(u => u.id === lead.counsellorId);
      const notes = data.counsellorNotes
        .filter(n => n.leadId === id)
        .map(n => ({
          ...n,
          author: data.users.find(u => u.id === n.authorId)
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const activityLogs = data.activityLogs
        .filter(l => l.leadId === id)
        .map(l => ({
          ...l,
          user: data.users.find(u => u.id === l.userId)
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return {
        ...lead,
        campus,
        program,
        course,
        counsellor,
        notes,
        activityLogs,
      };
    }

    return await prisma.lead.findUnique({
      where: { id },
      include: {
        campus: true,
        program: true,
        course: true,
        counsellor: true,
        notes: { include: { author: true }, orderBy: { createdAt: 'desc' } },
        activityLogs: { include: { user: true }, orderBy: { createdAt: 'desc' } },
      }
    });
  },

  async leadCreate(payload: any) {
    if (isMock) {
      const data = mockDb.getMockDb();
      const newLead = {
        ...payload,
        id: `ld-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data.leads.push(newLead);

      // Create log
      const newLog = {
        id: `lg-${Math.floor(1000 + Math.random() * 9000)}`,
        action: 'Lead Created',
        userId: payload.counsellorId || 'usr-1',
        leadId: newLead.id,
        createdAt: new Date().toISOString(),
      };
      data.activityLogs.push(newLog);

      mockDb.saveMockDb(data);
      return newLead;
    }

    return await prisma.lead.create({
      data: {
        ...payload,
        activityLogs: {
          create: {
            action: 'Lead Created',
            userId: payload.counsellorId || 'usr-1',
          }
        }
      }
    });
  },

  async leadUpdate(id: string, payload: any) {
    if (isMock) {
      const data = mockDb.getMockDb();
      const idx = data.leads.findIndex(l => l.id === id);
      if (idx !== -1) {
        const oldLead = data.leads[idx];
        const updated = {
          ...oldLead,
          ...pruneUndefined(payload),
          updatedAt: new Date().toISOString()
        };
        data.leads[idx] = updated;

        // Log if status changed
        if (payload.status && payload.status !== oldLead.status) {
          data.activityLogs.push({
            id: `lg-${Math.floor(1000 + Math.random() * 9000)}`,
            action: `Status changed to ${payload.status.replace('_', ' ')}`,
            userId: 'usr-1', // Default simulation editor
            leadId: id,
            createdAt: new Date().toISOString(),
          });
        }

        // Log if counsellor assigned
        if (payload.counsellorId && payload.counsellorId !== oldLead.counsellorId) {
          const name = data.users.find(u => u.id === payload.counsellorId)?.name || 'Counsellor';
          data.activityLogs.push({
            id: `lg-${Math.floor(1000 + Math.random() * 9000)}`,
            action: `Lead assigned to ${name}`,
            userId: 'usr-1',
            leadId: id,
            createdAt: new Date().toISOString(),
          });
        }

        mockDb.saveMockDb(data);
        return updated;
      }
      return null;
    }

    // Log status or counsellor change if applicable
    const oldLead = await prisma.lead.findUnique({ where: { id } });
    if (oldLead) {
      const logs = [];
      if (payload.status && payload.status !== oldLead.status) {
        logs.push({ action: `Status changed to ${payload.status.replace('_', ' ')}`, userId: 'usr-1' });
      }
      if (payload.counsellorId && payload.counsellorId !== oldLead.counsellorId) {
        const counsellor = await prisma.user.findUnique({ where: { id: payload.counsellorId } });
        logs.push({ action: `Lead assigned to ${counsellor?.name || 'Counsellor'}`, userId: 'usr-1' });
      }
      if (logs.length > 0) {
        await prisma.lead.update({
          where: { id },
          data: {
            ...payload,
            activityLogs: {
              createMany: { data: logs }
            }
          }
        });
        return await prisma.lead.findUnique({ where: { id } });
      }
    }

    return await prisma.lead.update({ where: { id }, data: payload });
  },

  async noteCreate(payload: { note: string; authorId: string; leadId: string }) {
    if (isMock) {
      const data = mockDb.getMockDb();
      const newNote = {
        ...payload,
        id: `nt-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
      };
      data.counsellorNotes.push(newNote);

      data.activityLogs.push({
        id: `lg-${Math.floor(1000 + Math.random() * 9000)}`,
        action: 'Counsellor note added',
        userId: payload.authorId,
        leadId: payload.leadId,
        createdAt: new Date().toISOString(),
      });

      mockDb.saveMockDb(data);
      return {
        ...newNote,
        author: data.users.find(u => u.id === payload.authorId),
      };
    }

    return await prisma.counsellorNote.create({
      data: {
        note: payload.note,
        lead: {
          connect: { id: payload.leadId }
        },
        author: {
          connect: { id: payload.authorId }
        }
      },
      include: { author: true }
    });
  },

  // Applications
  async applicationFindMany(filters?: { campusId?: string; status?: string }) {
    if (isMock) {
      const data = mockDb.getMockDb();
      let list = [...data.applications];

      if (filters?.campusId) {
        list = list.filter(a => a.campusId === filters.campusId);
      }
      if (filters?.status) {
        list = list.filter(a => a.status === filters.status);
      }

      return list.map(a => ({
        ...a,
        student: data.users.find(u => u.id === a.studentId),
        parent: data.users.find(u => u.id === a.parentId),
        campus: data.campuses.find(c => c.id === a.campusId),
        program: data.programs.find(p => p.id === a.programId),
        course: data.courses.find(c => c.id === a.courseId),
        documents: data.documents.filter(d => d.applicationId === a.id),
      })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const where: any = {};
    if (filters?.campusId) where.campusId = filters.campusId;
    if (filters?.status) where.status = filters.status;

    return await prisma.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        student: true,
        parent: true,
        campus: true,
        program: true,
        course: true,
        documents: true
      }
    });
  },

  async applicationFindUnique(id: string) {
    if (isMock) {
      const data = mockDb.getMockDb();
      const app = data.applications.find(a => a.id === id);
      if (!app) return null;

      const student = data.users.find(u => u.id === app.studentId);
      const parent = data.users.find(u => u.id === app.parentId);
      const campus = data.campuses.find(c => c.id === app.campusId);
      const program = data.programs.find(p => p.id === app.programId);
      const course = data.courses.find(c => c.id === app.courseId);
      const documents = data.documents.filter(d => d.applicationId === id);

      return {
        ...app,
        student,
        parent,
        campus,
        program,
        course,
        documents,
      };
    }

    return await prisma.application.findUnique({
      where: { id },
      include: {
        student: true,
        parent: true,
        campus: true,
        program: true,
        course: true,
        documents: true
      }
    });
  },

  async applicationUpdate(id: string, payload: any) {
    if (isMock) {
      const data = mockDb.getMockDb();
      const idx = data.applications.findIndex(a => a.id === id);
      if (idx !== -1) {
        const old = data.applications[idx];
        const updated = {
          ...old,
          ...pruneUndefined(payload),
          updatedAt: new Date().toISOString()
        };
        data.applications[idx] = updated;

        // Sync Lead status if matching lead exists (mock logic)
        const leadIdx = data.leads.findIndex(l => l.email === data.users.find(u => u.id === old.studentId)?.email);
        if (leadIdx !== -1 && payload.status) {
          data.leads[leadIdx].status = payload.status;
        }

        mockDb.saveMockDb(data);
        return updated;
      }
      return null;
    }

    const app = await prisma.application.update({ where: { id }, data: payload });
    // Keep corresponding lead status in sync
    const student = await prisma.user.findUnique({ where: { id: app.studentId } });
    if (student && payload.status) {
      await prisma.lead.updateMany({
        where: { email: student.email },
        data: { status: payload.status }
      });
    }
    return app;
  },

  // Documents
  async documentCreate(payload: any) {
    if (isMock) {
      const data = mockDb.getMockDb();
      const newDoc = {
        ...payload,
        id: `doc-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.documents.push(newDoc);
      mockDb.saveMockDb(data);
      return newDoc;
    }
    return await prisma.document.create({ data: payload });
  },

  async documentUpdate(id: string, payload: any) {
    if (isMock) {
      const data = mockDb.getMockDb();
      const idx = data.documents.findIndex(d => d.id === id);
      if (idx !== -1) {
        const updated = {
          ...data.documents[idx],
          ...pruneUndefined(payload),
          updatedAt: new Date().toISOString()
        };
        data.documents[idx] = updated;
        mockDb.saveMockDb(data);
        return updated;
      }
      return null;
    }
    return await prisma.document.update({ where: { id }, data: payload });
  },

  // Notifications
  async notificationFindMany(userId: string) {
    if (isMock) {
      return mockDb.getMockDb().notifications
        .filter(n => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  },

  async notificationMarkRead(id: string) {
    if (isMock) {
      const data = mockDb.getMockDb();
      const idx = data.notifications.findIndex(n => n.id === id);
      if (idx !== -1) {
        data.notifications[idx].isRead = true;
        mockDb.saveMockDb(data);
        return true;
      }
      return false;
    }
    return await prisma.notification.update({ where: { id }, data: { isRead: true } });
  },

  // Reports
  async reportFindMany() {
    if (isMock) {
      return mockDb.getMockDb().reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return await prisma.report.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async reportCreate(payload: any) {
    if (isMock) {
      const data = mockDb.getMockDb();
      const newReport = {
        ...payload,
        id: `rp-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString()
      };
      data.reports.push(newReport);
      mockDb.saveMockDb(data);
      return newReport;
    }
    return await prisma.report.create({ data: payload });
  }
};
