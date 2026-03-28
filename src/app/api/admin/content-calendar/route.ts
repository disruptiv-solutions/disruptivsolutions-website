import { NextRequest, NextResponse } from 'next/server';
import { initFirebaseAdmin } from '@/lib/firebase-admin';
import { verifyAdminBearer } from '@/lib/verify-admin-request';
import {
  eachUtcYmdInRange,
  formatUtcYmd,
  parseUtcYmd,
  utcDateToBriefSlug,
} from '@/lib/daily-brief-date-slug';

export const dynamic = 'force-dynamic';

const CONTENT_CALENDAR_COLLECTION = 'content_calendar';

export type ContentCalendarCustomType = 'newsletter' | 'social' | 'other';

type CustomDoc = {
  scheduledDate: string;
  type: ContentCalendarCustomType;
  title: string;
  notes?: string;
  pushed: boolean;
  pushedAt?: string | null;
  createdAt?: string;
};

type CustomDocWithId = CustomDoc & { id: string };

const getUnauthorized = () =>
  NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

const clampDays = (n: number): number => Math.min(Math.max(n, 7), 120);

export async function GET(request: NextRequest) {
  const adminUser = await verifyAdminBearer(request);
  if (!adminUser) {
    return getUnauthorized();
  }

  const { adminDb, error } = initFirebaseAdmin();
  if (!adminDb) {
    return NextResponse.json(
      { error: error || 'Firebase Admin not configured' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');
  const daysParam = searchParams.get('days');

  const todayUtc = new Date();
  let startYmd: string;
  let endYmd: string;

  if (startParam && endParam) {
    startYmd = startParam;
    endYmd = endParam;
  } else {
    const days = clampDays(Number(daysParam) || 45);
    startYmd = formatUtcYmd(todayUtc);
    const endDate = new Date(todayUtc);
    endDate.setUTCDate(endDate.getUTCDate() + days - 1);
    endYmd = formatUtcYmd(endDate);
  }

  const ymdList = eachUtcYmdInRange(startYmd, endYmd);
  if (ymdList.length === 0) {
    return NextResponse.json({ error: 'Invalid date range' }, { status: 400 });
  }

  try {
    const briefRefs = ymdList.map((ymd) => {
      const slug = utcDateToBriefSlug(parseUtcYmd(ymd));
      return adminDb.collection('daily-briefs').doc(slug);
    });
    const briefSnaps = await adminDb.getAll(...briefRefs);

    const briefByYmd = new Map<string, { pushedAt: string | null }>();
    ymdList.forEach((ymd, i) => {
      const snap = briefSnaps[i];
      if (snap.exists) {
        const data = snap.data() as { generatedAt?: string };
        briefByYmd.set(ymd, { pushedAt: data.generatedAt ?? null });
      }
    });

    const customSnap = await adminDb
      .collection(CONTENT_CALENDAR_COLLECTION)
      .where('scheduledDate', '>=', startYmd)
      .where('scheduledDate', '<=', endYmd)
      .get();

    const customByYmd = new Map<string, CustomDocWithId[]>();
    for (const doc of customSnap.docs) {
      const data = doc.data() as CustomDoc;
      const list: CustomDocWithId[] = customByYmd.get(data.scheduledDate) ?? [];
      list.push({ id: doc.id, ...data });
      customByYmd.set(data.scheduledDate, list);
    }

    const days = ymdList.map((ymd) => {
      const d = parseUtcYmd(ymd);
      const displayLabel = d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      });

      const slug = utcDateToBriefSlug(d);
      const briefMeta = briefByYmd.get(ymd);

      const items: Array<{
        id: string;
        kind: 'recurring' | 'custom';
        type: string;
        title: string;
        pushed: boolean;
        pushedAt: string | null;
        href: string | null;
        notes: string | null;
        briefSlug?: string | null;
        dailyBriefEmail?: boolean;
      }> = [
        {
          id: `daily-brief:${ymd}`,
          kind: 'recurring',
          type: 'daily_brief',
          title: 'Daily AI Brief',
          pushed: Boolean(briefMeta),
          pushedAt: briefMeta?.pushedAt ?? null,
          href: `/brief/${slug}`,
          notes: null,
          briefSlug: slug,
          dailyBriefEmail: Boolean(briefMeta),
        },
      ];

      const customs = customByYmd.get(ymd) ?? [];
      for (const c of customs) {
        items.push({
          id: c.id,
          kind: 'custom',
          type: c.type,
          title: c.title,
          pushed: Boolean(c.pushed),
          pushedAt: c.pushedAt ?? null,
          href: null,
          notes: c.notes ?? null,
        });
      }

      return { date: ymd, displayLabel, items };
    });

    return NextResponse.json({
      success: true,
      range: { start: startYmd, end: endYmd },
      days,
    });
  } catch (e) {
    console.error('[content-calendar GET]', e);
    return NextResponse.json({ error: 'Failed to load calendar' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminUser = await verifyAdminBearer(request);
  if (!adminUser) {
    return getUnauthorized();
  }

  const { adminDb, error } = initFirebaseAdmin();
  if (!adminDb) {
    return NextResponse.json(
      { error: error || 'Firebase Admin not configured' },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as {
      scheduledDate?: string;
      type?: ContentCalendarCustomType;
      title?: string;
      notes?: string;
    };

    const { scheduledDate, type, title, notes } = body;
    if (!scheduledDate || !type || !title?.trim()) {
      return NextResponse.json(
        { error: 'scheduledDate, type, and title are required' },
        { status: 400 }
      );
    }

    const allowed: ContentCalendarCustomType[] = ['newsletter', 'social', 'other'];
    if (!allowed.includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const ref = await adminDb.collection(CONTENT_CALENDAR_COLLECTION).add({
      scheduledDate,
      type,
      title: title.trim(),
      notes: notes?.trim() || '',
      pushed: false,
      pushedAt: null,
      createdAt: new Date().toISOString(),
      createdBy: adminUser.uid,
    });

    return NextResponse.json({ success: true, id: ref.id });
  } catch (e) {
    console.error('[content-calendar POST]', e);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const adminUser = await verifyAdminBearer(request);
  if (!adminUser) {
    return getUnauthorized();
  }

  const { adminDb, error } = initFirebaseAdmin();
  if (!adminDb) {
    return NextResponse.json(
      { error: error || 'Firebase Admin not configured' },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as {
      id?: string;
      pushed?: boolean;
    };

    const { id, pushed } = body;
    if (!id || typeof pushed !== 'boolean') {
      return NextResponse.json({ error: 'id and pushed (boolean) required' }, { status: 400 });
    }

    if (id.startsWith('daily-brief:')) {
      return NextResponse.json(
        { error: 'Daily brief push state is derived from Firestore; cannot toggle here.' },
        { status: 400 }
      );
    }

    const ref = adminDb.collection(CONTENT_CALENDAR_COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const pushedAt = pushed ? new Date().toISOString() : null;
    await ref.update({
      pushed,
      pushedAt,
      updatedAt: new Date().toISOString(),
      updatedBy: adminUser.uid,
    });

    return NextResponse.json({ success: true, pushed, pushedAt });
  } catch (e) {
    console.error('[content-calendar PATCH]', e);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}
