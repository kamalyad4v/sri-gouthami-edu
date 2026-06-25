const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, 'mock_db_data.json');
  if (!fs.existsSync(dataPath)) {
    console.error('Mock database file not found at:', dataPath);
    process.exit(1);
  }

  console.log('Reading mock database file...');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(rawData);

  console.log('Cleaning up existing data...');
  // Delete in reverse dependency order
  await prisma.report.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.activityLog.deleteMany({});
  await prisma.counsellorNote.deleteMany({});
  await prisma.admission.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.campus.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding Users...');
  for (const u of data.users) {
    await prisma.user.create({
      data: {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        clerkUserId: u.clerkUserId,
        createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
      }
    });
  }

  console.log('Seeding Campuses...');
  for (const c of data.campuses) {
    await prisma.campus.create({
      data: {
        id: c.id,
        name: c.name,
        type: c.type,
        address: c.address,
      }
    });
  }

  console.log('Seeding Programs...');
  for (const p of data.programs) {
    await prisma.program.create({
      data: {
        id: p.id,
        name: p.name,
        duration: p.duration,
        campusId: p.campusId,
      }
    });
  }

  console.log('Seeding Courses...');
  for (const c of data.courses) {
    await prisma.course.create({
      data: {
        id: c.id,
        name: c.name,
        description: c.description,
        eligibility: c.eligibility,
        fees: c.fees,
        programId: c.programId,
      }
    });
  }

  console.log('Seeding Leads...');
  for (const l of data.leads) {
    await prisma.lead.create({
      data: {
        id: l.id,
        studentName: l.studentName,
        parentName: l.parentName,
        mobile: l.mobile,
        email: l.email,
        address: l.address,
        leadSource: l.leadSource,
        status: l.status,
        createdAt: l.createdAt ? new Date(l.createdAt) : new Date(),
        updatedAt: l.updatedAt ? new Date(l.updatedAt) : new Date(),
        campusId: l.campusId,
        programId: l.programId,
        courseId: l.courseId,
        counsellorId: l.counsellorId || null,
      }
    });
  }

  console.log('Seeding Applications...');
  for (const a of data.applications) {
    await prisma.application.create({
      data: {
        id: a.id,
        applicationNo: a.applicationNo,
        studentId: a.studentId,
        parentId: a.parentId || null,
        campusId: a.campusId,
        programId: a.programId,
        courseId: a.courseId,
        status: a.status,
        aiSummary: a.aiSummary || null,
        aiRiskFlags: a.aiRiskFlags || null,
        aiRecommendation: a.aiRecommendation || null,
        createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
        updatedAt: a.updatedAt ? new Date(a.updatedAt) : new Date(),
      }
    });
  }

  console.log('Seeding Documents...');
  for (const d of data.documents) {
    await prisma.document.create({
      data: {
        id: d.id,
        name: d.name,
        url: d.url,
        status: d.status,
        rejectionReason: d.rejectionReason || null,
        applicationId: d.applicationId,
        createdAt: d.createdAt ? new Date(d.createdAt) : new Date(),
      }
    });
  }

  console.log('Seeding Admissions...');
  for (const adm of data.admissions) {
    await prisma.admission.create({
      data: {
        id: adm.id,
        admissionNo: adm.admissionNo,
        feesPaid: adm.feesPaid,
        totalFees: adm.totalFees,
        applicationId: adm.applicationId,
        admittedAt: adm.admittedAt ? new Date(adm.admittedAt) : new Date(),
      }
    });
  }

  console.log('Seeding Counsellor Notes...');
  for (const n of data.counsellorNotes) {
    await prisma.counsellorNote.create({
      data: {
        id: n.id,
        note: n.note,
        authorId: n.authorId,
        leadId: n.leadId,
        createdAt: n.createdAt ? new Date(n.createdAt) : new Date(),
      }
    });
  }

  console.log('Seeding Activity Logs...');
  for (const log of data.activityLogs) {
    await prisma.activityLog.create({
      data: {
        id: log.id,
        action: log.action,
        userId: log.userId,
        leadId: log.leadId,
        createdAt: log.createdAt ? new Date(log.createdAt) : new Date(),
      }
    });
  }

  console.log('Seeding Notifications...');
  for (const nf of data.notifications) {
    await prisma.notification.create({
      data: {
        id: nf.id,
        title: nf.title,
        message: nf.message,
        isRead: nf.isRead,
        userId: nf.userId,
        createdAt: nf.createdAt ? new Date(nf.createdAt) : new Date(),
      }
    });
  }

  console.log('Seeding Reports...');
  for (const r of data.reports) {
    await prisma.report.create({
      data: {
        id: r.id,
        title: r.title,
        type: r.type,
        format: r.format,
        generatedBy: r.generatedBy,
        url: r.url,
        createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
      }
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
