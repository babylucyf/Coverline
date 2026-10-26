// All figures are sample data for a concept project.
export const TODAY = { label: 'Thursday 22 Oct 2026', week: 43 }

export const kpis = [
  { label: 'Production, week 42', value: '92%', sub: '18,400 of 20,000 cases planned', chip: { tone: 'low', text: '1,600 cases short' } },
  { label: 'Stock in warehouses', value: '64,200', sub: 'cases · 11.6 days of cover' },
  { label: 'In staff pack window', value: '4 batches', sub: '2 decided but not yet done', chip: { tone: 'out', text: 'Oldest waiting 3 days' } },
  { label: 'On QA hold', value: '6 batches', sub: 'Oldest held 9 days, results late' },
]

export const production = [
  { wk: 'Wk 38', produced: 19200, plan: 20000, note: '96%', short: true },
  { wk: 'Wk 39', produced: 20000, plan: 20000, note: '100%' },
  { wk: 'Wk 40', produced: 19200, plan: 20000, note: '96%', short: true },
  { wk: 'Wk 41', produced: 20400, plan: 20000, note: '102%' },
  { wk: 'Wk 42', produced: 18400, plan: 20000, note: '92%', short: true },
  { wk: 'Wk 43', produced: 9100, plan: 20000, note: 'to date', current: true },
  { wk: 'Wk 44', produced: 0, plan: 21000, note: 'plan', future: true },
]

export const risks = [
  { product: 'Malt drink 33cl ×24', week: 'Week 44', tone: 'out', status: 'Stuck', text: 'Malt extract runs out at the end of week 44. The W47 shipment is held at Apapa. Not flagged to factory planning yet.', to: 'materials' },
  { product: 'Cooking oil 1L', week: 'Week 43', tone: 'out', status: 'Stuck', text: 'Kano batch on QA hold 9 days, results 2 days late. 400 cases cannot ship.', to: 'qa' },
  { product: 'Corn flakes 350g', week: 'Week 44', tone: 'low', status: 'Low cover', text: 'Kano needs 90 more shipper cartons before it can repackage 210 cases.', to: 'materials' },
  { product: 'Tomato paste 70g', week: 'Week 43', tone: 'low', status: 'Delayed', text: 'Line 3 down 6 hours on Tuesday for repairs. Recovering on the Saturday shift.', to: 'stock' },
]

export const stages = [
  { name: 'Factory', cases: 8400, share: 7, tone: 1 },
  { name: 'In transit', cases: 6150, share: 5, tone: 2 },
  { name: 'Warehouses', cases: 64200, share: 53, tone: 3 },
  { name: 'Trade', cases: 41800, share: 35, tone: 4 },
]

export const shipments = [
  { name: 'Malt extract', qty: '60 tonnes', eta: 'Mon 23 Nov', tone: 'low', status: 'Delayed' },
  { name: 'Cocoa powder', qty: '20 tonnes', eta: 'Mon 23 Nov', tone: 'low', status: 'Delayed' },
  { name: 'Tinplate cans 160g', qty: '600k cans', eta: 'Mon 16 Nov', tone: 'neutral', status: 'In transit' },
  { name: 'Wheat flour', qty: '140 tonnes', eta: 'Mon 16 Nov', tone: 'neutral', status: 'In transit' },
]

export const launches = [
  { name: 'Noodles chicken, 5+1 promo pack', sub: 'Launch Mon 3 Nov', tone: 'safe', status: 'Ready' },
  { name: 'Chocolate drink 900g, new SKU', sub: 'Launch Mon 7 Dec · Pouch quantity not sent', tone: 'low', status: 'At risk' },
  { name: 'Instant noodles pepper soup, new SKU', sub: 'Launch Mon 4 Jan · Carton sizes not in', tone: 'low', status: 'At risk' },
]

export const stock = [
  { name: 'Seasoning cubes 4g ×100', sku: 'SSN-004-CB', cat: 'Culinary', wh: 'Onitsha', cases: 0, cover: 0, life: null, lifeNote: 'No stock', status: 'out' },
  { name: 'Powdered milk 400g', sku: 'MLK-400-PD', cat: 'Dairy', wh: 'Abuja', cases: 0, cover: 0, life: null, lifeNote: 'No stock', status: 'out' },
  { name: 'Instant noodles, chicken 70g', sku: 'NDL-070-CH', cat: 'Noodles', wh: 'Kano', cases: 840, cover: 2.1, life: 142, lifeNote: 'Expires 13 Mar 2027', status: 'low' },
  { name: 'Custard powder 300g', sku: 'CST-300-VN', cat: 'Culinary', wh: 'Port Harcourt', cases: 460, cover: 3.2, life: 118, lifeNote: 'Staff pack window in 28 days', lifeTone: 'low', status: 'low' },
  { name: 'Tomato paste 70g', sku: 'TMP-070-SC', cat: 'Culinary', wh: 'Abuja', cases: 1120, cover: 4.6, life: 84, lifeNote: 'Pull for staff pack now', lifeTone: 'out', status: 'low' },
  { name: 'Malt drink 33cl ×24', sku: 'MLT-033-24', cat: 'Beverages', wh: 'Onitsha', cases: 1940, cover: 6.1, life: 95, lifeNote: 'Staff pack window in 5 days', lifeTone: 'low', status: 'low' },
  { name: 'Bottled water 75cl ×12', sku: 'WTR-075-12', cat: 'Beverages', wh: 'Ibadan', cases: 3950, cover: 8.7, life: 210, lifeNote: 'Expires 20 May 2027', status: 'safe' },
  { name: 'Chocolate drink 400g', sku: 'CHC-400-TN', cat: 'Beverages', wh: 'Lagos', cases: 2780, cover: 9.3, life: 103, lifeNote: 'Staff pack window in 13 days', lifeTone: 'low', status: 'safe' },
  { name: 'Cooking oil 1L', sku: 'OIL-001-VG', cat: 'Culinary', wh: 'Lagos', cases: 4480, cover: 10.2, life: 260, lifeNote: 'Expires 9 Jul 2027', status: 'safe' },
  { name: 'Instant noodles, onion 70g', sku: 'NDL-070-ON', cat: 'Noodles', wh: 'Ibadan', cases: 3300, cover: 11.0, life: 71, lifeNote: 'Pull for staff pack now', lifeTone: 'out', status: 'safe' },
  { name: 'Evaporated milk 160g', sku: 'MLK-160-EV', cat: 'Dairy', wh: 'Lagos', cases: 6200, cover: 12.4, life: 180, lifeNote: 'Expires 20 Apr 2027', status: 'safe' },
  { name: 'Corn flakes 350g', sku: 'CFL-350-OR', cat: 'Cereals', wh: 'Kano', cases: 5310, cover: 14.8, life: 164, lifeNote: 'Expires 4 Apr 2027', status: 'safe' },
]

// Freshness: staff pack window opens 90 days before expiry. Today is 22 Oct 2026.
export const batches = [
  { id: 'B-2408-11', cat: 'Noodles', name: 'Instant noodles, onion 70g', wh: 'Ibadan', cases: 3300, days: 71, expires: '1 Jan 2027', window: 'Window opened 3 Oct', decision: 'Staff pack', task: { tone: 'out', text: 'Waiting 3 days' } },
  { id: 'B-2409-09', cat: 'Culinary', name: 'Cooking oil 1L', wh: 'Kano', cases: 120, days: 74, expires: '4 Jan 2027', window: 'Window opened 6 Oct', decision: 'Destroy', task: { tone: 'safe', text: 'Done' } },
  { id: 'B-2407-22', cat: 'Culinary', name: 'Tomato paste 70g', wh: 'Abuja', cases: 1120, days: 84, expires: '14 Jan 2027', window: 'Window opened 16 Oct', decision: 'Staff pack', task: { tone: 'safe', text: 'Done' } },
  { id: 'B-2409-28', cat: 'Cereals', name: 'Corn flakes 350g', wh: 'Kano', cases: 210, days: 88, expires: '18 Jan 2027', window: 'Window opened 20 Oct', decision: 'Repackage', damaged: true, task: { tone: 'low', text: 'Waiting 2 days' } },
  { id: 'B-2408-30', cat: 'Dairy', name: 'Evaporated milk 160g', wh: 'Lagos', cases: 380, days: 92, expires: '22 Jan 2027', window: 'Window opens 24 Oct', decision: 'Staff pack', task: { tone: 'low', text: 'Waiting 1 day' } },
  { id: 'B-2409-03', cat: 'Beverages', name: 'Malt drink 33cl ×24', wh: 'Onitsha', cases: 640, days: 95, expires: '25 Jan 2027', window: 'Window opens 27 Oct', windowLong: 'Opens Mon 27 Oct, in 5 days', decision: null, task: { tone: 'neutral', text: 'Not decided' } },
  { id: 'B-2409-17', cat: 'Beverages', name: 'Chocolate drink 400g', wh: 'Lagos', cases: 900, days: 103, expires: '2 Feb 2027', window: 'Window opens 4 Nov', decision: 'Trade priority', task: { tone: 'low', text: 'Waiting 1 day' } },
  { id: 'B-2410-02', cat: 'Culinary', name: 'Custard powder 300g', wh: 'Port Harcourt', cases: 460, days: 118, expires: '17 Feb 2027', window: 'Window opens 19 Nov', windowLong: 'Opens Thu 19 Nov, in 28 days', decision: null, task: { tone: 'neutral', text: 'Not decided' } },
]

export const routes = [
  { key: 'Staff pack', desc: 'Carton is fine and the batch is near 3 months. Pull for staff sales.' },
  { key: 'Trade priority', desc: 'Push to distributors ahead of newer stock.' },
  { key: 'Repackage', desc: 'For good product in a damaged carton.', needsDamage: true, blocked: 'No damage reported. Repackaging is for good product in a damaged carton.' },
  { key: 'Destroy', desc: 'Cannot be used or sold. Recorded as a write-off.' },
]

export const weeks = [
  ['W43', 'This wk'], ['W44', '2 Nov'], ['W45', '9 Nov'], ['W46', '16 Nov'], ['W47', '23 Nov'],
  ['W48', '30 Nov'], ['W49', '7 Dec'], ['W50', '14 Dec'], ['W51', '21 Dec'], ['W52', '28 Dec'],
]

// cell: [weeks of cover, arrival note]; 'S' = short (line stops)
export const materials = [
  { name: 'Malt extract', code: 'RM-1042', origin: 'Imported', lead: '13 wk lead', onHand: '18 t', cover: 1.4, coverTone: 'low',
    cells: [[1.4], [0.9], ['S'], ['S'], [4.8, 'in 60 t'], [3.8], [2.8], [1.8], [4.0, 'in 40 t'], [3.0]],
    risk: { title: 'Malt drink 33cl ×24', note: 'Line 2 stops in W45', tone: 'out' }, action: 'flag' },
  { name: 'Cocoa powder', code: 'RM-1107', origin: 'Imported', lead: '10 wk lead', onHand: '9.2 t', cover: 2.1, coverTone: 'low',
    cells: [[2.1], [1.5], [0.5], ['S'], [4.5, '20 t late', true], [3.5], [2.5], [1.5], [3.2, 'in 12 t'], [2.2]],
    risk: { title: 'Chocolate drink 400g', note: 'Line 1 stops in W46', tone: 'out' }, action: 'flagged', flaggedOn: '21 Oct', flagStatus: 'Planning expediting' },
  { name: 'Tinplate cans 160g', code: 'PM-2210', origin: 'Imported', lead: '14 wk lead', onHand: '1.43M cans', cover: 10.2,
    cells: [[10.2], [9.2], [8.2], [11.5, 'in 600k'], [10.5], [9.5], [8.5], [11.8, 'in 600k'], [10.8], [9.8]],
    risk: { title: 'None', note: 'Lands as cover hits 8 wks', tone: 'muted' } },
  { name: 'Shipper cartons, all SKUs', code: 'PM-2004', origin: 'Local', lead: '1 wk lead', onHand: '85k cartons', cover: 2.6,
    cells: [[2.6], [2.1, 'in 30k'], [1.8], [2.3, 'in 30k'], [2.0], [2.4, 'in 30k'], [2.2], [2.5, 'in 30k'], [2.3], [2.6, 'in 30k']],
    risk: { title: 'None', note: '414 set aside for repacking', tone: 'low' } },
  { name: 'Wheat flour', code: 'RM-1001', origin: 'Local', lead: '1 wk lead', onHand: '220 t', cover: 4.2,
    cells: [[4.2], [3.2], [2.2], [4.8, 'in 140 t'], [3.8], [2.8], [5.1, 'in 120 t'], [4.1], [3.1], [2.1]], risk: { title: 'None' } },
  { name: 'Laminate film, noodles', code: 'PM-2301', origin: 'Local', lead: '2 wk lead', onHand: '1.2M packs', cover: 4.8,
    cells: [[4.8], [3.8], [2.8], [4.4, 'in 400k'], [3.4], [2.4], [4.0, 'in 400k'], [3.0], [2.0], [3.6, 'in 400k']], risk: { title: 'None' } },
  { name: 'Palm olein', code: 'RM-1015', origin: 'Local', lead: '2 wk lead', onHand: '140 t', cover: 5.5,
    cells: [[5.5], [4.5], [3.5], [2.5], [5.0, 'in 65 t'], [4.0], [3.0], [5.2, 'in 55 t'], [4.2], [3.2]], risk: { title: 'None' } },
]

export const safety = { Local: 2, Imported: 8 }

export const flagsSent = [
  { id: 'f-cocoa', material: 'Cocoa powder', sub: 'RM-1107 · Line 1 stops W46', qty: '10 t', by: 'Fri 13 Nov', sent: 'Wed 21 Oct', sentBy: 'Tola Ajayi', reply: 'Forwarder is moving the cargo to an earlier vessel. Local cocoa does not meet spec, so no bridge buy.', replyBy: 'Ade Bakare · Thu 22 Oct, 09:30', open: true, status: { tone: 'low', text: 'Expediting' } },
  { id: 'f-wheat', material: 'Wheat flour', sub: 'RM-1001 · weekly top-up', qty: '140 t', by: 'Mon 16 Nov', sent: 'Mon 12 Oct', sentBy: 'Tola Ajayi', reply: 'Ordered. PO 4500-3410, 2 of 4 trucks on the road.', replyBy: 'Ade Bakare · Mon 12 Oct, 11:45', open: false, status: { tone: 'safe', text: 'Ordered' } },
]

export const qa = [
  { id: 'B-2408-02', name: 'Cooking oil 1L', loc: 'Kano', locSub: 'Warehouse', cases: 400, reason: 'Testing warehouse stock', reasonSub: 'Routine shelf check', type: 'Warehouse stock', held: 9, heldTone: 'out', due: 'Tue 20 Oct', dueSub: '2 days late', dueTone: 'out', stage: { tone: 'out', text: 'Awaiting sign-off' }, next: 'Back to Kano stock', nextSub: 'Trade priority task waits', chase: true },
  { id: 'B-2410-21', name: 'Malt drink 33cl ×24', loc: 'Factory', locSub: 'Line 2', cases: 2400, reason: 'Testing factory output', reasonSub: 'New production run', type: 'Factory output', held: 6, heldTone: 'low', due: 'Fri 23 Oct', dueSub: 'Tomorrow', dueTone: 'low', stage: { tone: 'low', text: 'In lab' }, next: 'Dispatch week 44', nextSub: 'Planned in DOR' },
  { id: 'B-2410-03', name: 'Chocolate drink 400g', loc: 'Factory', locSub: 'Line 1', cases: 1800, reason: 'Testing factory output', reasonSub: 'New production run', type: 'Factory output', held: 4, due: 'Tue 27 Oct', dueSub: 'In 5 days', stage: { tone: 'low', text: 'In lab' }, next: 'Dispatch week 44', nextSub: 'Planned in DOR' },
  { id: 'B-2409-15', name: 'Corn flakes 350g', loc: 'Lagos', locSub: 'Warehouse', cases: 85, reason: 'Pulled for staff pack by mistake', reasonSub: 'Batch not in the window', type: 'Staff pack by mistake', held: 3, due: 'Mon 26 Oct', dueSub: 'In 4 days', stage: { tone: 'neutral', text: 'Awaiting sign-off' }, next: 'Back to trade', nextSub: 'Removed from staff pack' },
  { id: 'B-2410-18', name: 'Instant noodles, onion 70g', loc: 'Factory', locSub: 'Line 3', cases: 5600, reason: 'Testing factory output', reasonSub: 'New production run', type: 'Factory output', held: 2, due: 'Mon 26 Oct', dueSub: 'In 4 days', stage: { tone: 'neutral', text: 'Sampling' }, next: 'Dispatch week 44', nextSub: 'Planned in DOR' },
  { id: 'B-2410-09', name: 'Custard powder 300g', loc: 'Lagos', locSub: 'Warehouse', cases: 24, reason: 'Damage check', reasonSub: 'Warehouse marked "Not sure"', type: 'Damage check', held: 1, due: 'Sat 24 Oct', dueSub: 'In 2 days', stage: { tone: 'neutral', text: 'Sampling' }, next: 'Freshness review', nextSub: 'Destroy or repackage' },
]

export const teams = [
  { key: 'hop', name: 'Head office planning', sub: '1 factory · 6 warehouses', user: ['AO', 'Adaeze'] },
  { key: 'dp', name: 'Demand planning', sub: '1 factory · 6 warehouses', user: ['FB', 'Femi'] },
  { key: 'mrp', name: 'MRP team', sub: '1 factory · 6 warehouses', user: ['TA', 'Tola'] },
  { key: 'inv', name: 'Inventory team', sub: 'Onitsha warehouse', user: ['AM', 'Amaka'] },
]

export const warehouses = ['Abuja', 'Ibadan', 'Kano', 'Lagos', 'Onitsha', 'Port Harcourt']

export const locations = [
  { name: 'Factory', kind: 'Factory · 3 lines', sync: '07:42', ok: true },
  { name: 'Lagos', kind: 'Warehouse', sync: '07:30', ok: true },
  { name: 'Abuja', kind: 'Warehouse', sync: '07:10', ok: true },
  { name: 'Kano', kind: 'Warehouse', sync: '04:40', ok: false },
  { name: 'Ibadan', kind: 'Warehouse', sync: '06:55', ok: true },
  { name: 'Onitsha', kind: 'Warehouse', sync: '06:10', ok: true },
  { name: 'Port Harcourt', kind: 'Warehouse', sync: '07:05', ok: true },
]

export const damaged = [
  { id: 'B-2410-11', name: 'Evaporated milk 160g', wh: 'Lagos', cases: 48, of: 1200, what: 'Rain got into Store 2', whatSub: 'Tins rusting at the seams', type: 'Rain or water', cond: 'compromised', expires: '14 Apr 2027', life: 174, reported: 'Reported today, 09:12', by: 'Tunde Adeyemi, Lagos inventory team', detail: 'Roof gutter overflowed overnight. 48 cases on the bottom pallets soaked through, tins rusting at the seams and labels peeling. The other 1,152 cases on the upper pallets are dry.', decision: null },
  { id: 'B-2410-14', name: 'Chocolate drink 400g', wh: 'Abuja', cases: 36, of: 900, what: 'Pests in the bay', whatSub: 'Sachets chewed through', type: 'Pests', cond: 'compromised', expires: '9 May 2027', life: 199, reported: 'Reported Wed 21 Oct, 16:40', by: 'Abuja inventory team', detail: 'Rodent damage found during the evening count. 36 cases with chewed sachets moved to the quarantine bay.', decision: null },
  { id: 'B-2409-28', name: 'Corn flakes 350g', wh: 'Kano', cases: 210, of: 600, what: 'Forklift tore cartons', whatSub: 'Inner bags intact', type: 'Crushed or torn in handling', cond: 'carton', expires: '18 Jan 2027', life: 88, reported: 'Reported Mon 19 Oct', by: 'Kano inventory team', decision: 'Repackage' },
  { id: 'B-2407-31', name: 'Tomato paste 210g', wh: 'Onitsha', cases: 180, of: 180, what: 'Cartons crushed in handling', whatSub: 'Tins not dented', type: 'Crushed or torn in handling', cond: 'carton', expires: '30 Mar 2027', life: 159, reported: 'Reported Mon 12 Oct', by: 'Onitsha inventory team', decision: 'Repackage' },
  { id: 'B-2409-20', name: 'Custard powder 300g', wh: 'Port Harcourt', cases: 24, of: 460, what: 'Roof leak soaked cartons', whatSub: 'Inner packs sealed and dry', type: 'Rain or water', cond: 'carton', expires: '17 Feb 2027', life: 118, reported: 'Reported Fri 9 Oct', by: 'Port Harcourt inventory team', decision: 'Repackage' },
]

export const tasks = [
  { id: 'B-2407-31', name: 'Tomato paste 210g', route: 'Repackage', bay: 'Bay C4', cases: 180, due: 'Tue 20 Oct', dueSub: '2 days overdue', dueTone: 'out', group: 'overdue', from: 'Femi Bello', fromSub: 'Mon 12 Oct', status: 'overdue', note: 'Repack all 180 cases into new shipper cartons. Cartons are in stock at Onitsha.' },
  { id: 'B-2408-19', name: 'Instant noodles, chicken 70g', route: 'Staff pack', bay: 'Bay A2', cases: 1450, pulled: 820, due: 'Fri 23 Oct', dueSub: 'Tomorrow', dueTone: 'low', group: 'week', from: 'Femi Bello', fromSub: 'Mon 19 Oct', status: 'progress', note: 'Pull all 1,450 cases for the October staff sale. Window opened 3 Oct, expiry 1 Jan 2027.' },
  { id: 'B-2409-12', name: 'Cooking oil 1L', route: 'Destroy', bay: 'Bay D3', cases: 60, due: 'Mon 26 Oct', dueSub: 'In 4 days', group: 'week', from: 'Femi Bello', fromSub: 'Wed 21 Oct', status: 'todo', note: 'Destroy 60 cases. Record the write-off reference when done.' },
  { id: 'B-2410-05', name: 'Custard powder 300g', route: 'Trade priority', bay: 'Bay A5', cases: 300, due: 'Wed 28 Oct', dueSub: 'In 6 days', group: 'later', from: 'Femi Bello', fromSub: 'Wed 21 Oct', status: 'todo', note: 'Load these 300 cases first on the next distributor trucks.' },
  { id: 'B-2409-03', name: 'Malt drink 33cl ×24', route: 'Staff pack', bay: 'Bay B1', cases: 640, due: 'Fri 30 Oct', dueSub: 'In 8 days', group: 'later', from: 'Femi Bello', fromSub: 'Today', status: 'new', note: 'Pull all 640 cases before the end-of-month staff sale.' },
]

export const missed = [
  { id: 'B-2405-08', name: 'Malt drink 33cl ×24', wh: 'Port Harcourt', destroyed: 310, of: 310, expired: 'Sat 17 Oct', opened: 'Sun 19 Jul', what: 'Decided Fri 9 Oct, 82 days after the window opened. Too late to pull', stuck: 'decision' },
  { id: 'B-2405-14', name: 'Evaporated milk 160g', wh: 'Lagos', destroyed: 620, of: 620, expired: 'Mon 12 Oct', opened: 'Tue 14 Jul', what: 'No route was ever chosen', stuck: 'decision' },
  { id: 'B-2404-22', name: 'Instant noodles, onion 70g', wh: 'Ibadan', destroyed: 800, of: 1100, expired: 'Mon 28 Sep', opened: 'Tue 30 Jun', what: 'Staff pack sent Sun 30 Aug. Warehouse pulled 300 cases before expiry', stuck: 'warehouse' },
  { id: 'B-2404-03', name: 'Tomato paste 70g', wh: 'Kano', destroyed: 240, of: 240, expired: 'Sun 20 Sep', opened: 'Mon 22 Jun', what: 'On QA hold for 26 days, testing warehouse stock. Released after expiry', stuck: 'qa' },
  { id: 'B-2403-30', name: 'Custard powder 300g', wh: 'Onitsha', destroyed: 90, of: 90, expired: 'Wed 2 Sep', opened: 'Thu 4 Jun', what: 'Staff pack task overdue 19 days at the warehouse', stuck: 'warehouse' },
  { id: 'B-2404-17', name: 'Cooking oil 1L', wh: 'Abuja', destroyed: 140, of: 140, expired: 'Mon 24 Aug', opened: 'Tue 26 May', what: 'No route was ever chosen', stuck: 'decision' },
]

export const released = [
  { id: 'B-2410-12', name: 'Bottled water 75cl ×12', loc: 'Factory', locSub: 'Line 3', cases: 3200, on: 'Mon 19 Oct', held: 3, next: 'Dispatched week 43' },
  { id: 'B-2409-31', name: 'Evaporated milk 160g', loc: 'Lagos', locSub: 'Warehouse', cases: 2400, on: 'Tue 20 Oct', held: 5, next: 'Back to Lagos stock' },
  { id: 'B-2410-07', name: 'Corn flakes 350g', loc: 'Factory', locSub: 'Line 2', cases: 2160, on: 'Wed 21 Oct', held: 4, next: 'Dispatched week 43' },
  { id: 'B-2410-01', name: 'Seasoning cubes 4g ×100', loc: 'Factory', locSub: 'Line 1', cases: 1200, on: 'Wed 21 Oct', held: 2, next: 'Dispatch week 44' },
]

export const rejected = [
  { id: 'B-2409-07', name: 'Powdered milk 400g', loc: 'Abuja', locSub: 'Warehouse', cases: 600, on: 'Fri 9 Oct', reason: 'Failed moisture test', next: 'Destroyed. Abuja out of stock until the next run' },
]

export const inbound = [
  { mat: 'Malt extract', po: 'PO 4500-3318', origin: 'Imported', from: 'Antwerp → Apapa', vessel: 'MV Carla Maersk', qty: '60 t', stages: ['Supplier', 'At sea', 'Port', 'Clearing', 'Road', 'Factory'], at: 2, where: 'At Apapa terminal, day 9. Clearing not started', whereTone: 'low', fac: '23 Nov', facSub: 'W47 · was 9 Nov', facTone: 'out', need: '2 Nov', needSub: 'W45', against: { tone: 'out', text: '3 wks late' }, late: true, team: 'Kunle, imports', teamSub: 'Today 08:15' },
  { mat: 'Cocoa powder', po: 'PO 4500-3290', origin: 'Imported', from: 'Abidjan → Tin Can', vessel: 'MV Atlantic Star', qty: '20 t', stages: ['Supplier', 'At sea', 'Port', 'Clearing', 'Road', 'Factory'], at: 1, where: 'At sea, 6 days out. Vessel delayed at Lomé', whereTone: 'low', fac: '23 Nov', facSub: 'W47 · was 9 Nov', facTone: 'out', need: '16 Nov', needSub: 'W46', against: { tone: 'out', text: '1 wk late' }, late: true, team: 'Kunle, imports', teamSub: 'Today 08:15' },
  { mat: 'Tinplate cans 160g', po: 'PO 4500-3344', origin: 'Imported', from: 'Shanghai → Apapa', vessel: 'MV Ever Gentle', qty: '600k', stages: ['Supplier', 'At sea', 'Port', 'Clearing', 'Road', 'Factory'], at: 3, where: 'Clearing, documents with customs', fac: '16 Nov', facSub: 'W46', need: '16 Nov', needSub: 'W46', against: { tone: 'low', text: 'No buffer' }, team: 'Kunle, imports', teamSub: 'Yesterday' },
  { mat: 'Malt extract', po: 'PO 4500-3402', origin: 'Imported', from: 'Antwerp → Apapa', vessel: 'Not booked yet', qty: '40 t', stages: ['Supplier', 'At sea', 'Port', 'Clearing', 'Road', 'Factory'], at: 0, where: 'Supplier producing, ships 6 Nov', fac: '14 Dec', facSub: 'W51', need: '21 Dec', needSub: 'W52', against: { tone: 'safe', text: '1 wk early' }, team: 'Kunle, imports', teamSub: 'Mon 19 Oct' },
  { mat: 'Wheat flour', po: 'PO 4500-3410', origin: 'Local', from: 'Local mill, Lagos', vessel: 'Weekly truck', qty: '140 t', stages: ['Ordered', 'On the road', 'Factory'], at: 1, where: 'On the road, 2 trucks of 4', fac: '16 Nov', facSub: 'W46', need: '23 Nov', needSub: 'W47', against: { tone: 'safe', text: '1 wk early' }, team: 'Supplier portal', teamSub: 'Today 07:30' },
  { mat: 'Laminate film, noodles', po: 'PO 4500-3398', origin: 'Local', from: 'Local converter, Ogun', vessel: '', qty: '400k', stages: ['Ordered', 'On the road', 'Factory'], at: 0, where: 'Ordered, dispatch 10 Nov', fac: '16 Nov', facSub: 'W46', need: '30 Nov', needSub: 'W48', against: { tone: 'safe', text: '2 wks early' }, team: 'Supplier email', teamSub: 'Wed 21 Oct' },
  { mat: 'Palm olein', po: 'PO 4500-3415', origin: 'Local', from: 'Local refinery, Lagos', vessel: '', qty: '65 t', stages: ['Ordered', 'On the road', 'Factory'], at: 0, where: 'Ordered, dispatch 18 Nov', fac: '23 Nov', facSub: 'W47', need: '7 Dec', needSub: 'W49', against: { tone: 'safe', text: '2 wks early' }, team: 'Supplier email', teamSub: 'Wed 21 Oct' },
]

export const repack = [
  { id: 'B-2409-28', name: 'Corn flakes 350g', wh: 'Kano', damage: 'Forklift tore cartons', damageSub: 'Reported Mon 19 Oct', cases: 210, carton: 'Corn flakes 350g shipper', code: 'CT-CFL-350', stock: 120, order: 90, by: 'Femi Bello', bySub: 'Freshness review, Tue 20 Oct', state: 'order' },
  { id: 'B-2407-31', name: 'Tomato paste 210g', wh: 'Onitsha', damage: 'Cartons crushed in handling', damageSub: 'Reported Mon 12 Oct', cases: 180, carton: 'Tomato paste 210g shipper', code: 'CT-TMP-210', stock: 2400, order: 0, by: 'Femi Bello', bySub: 'Freshness review, Tue 13 Oct', state: 'covered' },
  { id: 'B-2409-20', name: 'Custard powder 300g', wh: 'Port Harcourt', damage: 'Roof leak soaked cartons', damageSub: 'Reported Fri 9 Oct', cases: 24, carton: 'Custard powder 300g shipper', code: 'CT-CST-300', stock: 610, order: 0, by: 'Femi Bello', bySub: 'Freshness review, Tue 13 Oct', state: 'done', doneText: 'Repackaged, Thu 15 Oct' },
]

export const skus = [
  { sku: 'Chocolate drink 900g', comp: 'Pouch laminate, 180 × 260 mm', launch: '7 Dec', launchSub: 'W49', at: 2, note: 'Vendor confirmed Thu 15 Oct. Set quantity for launch and 4 weeks after', noteTone: 'low', orderBy: 'Mon 16 Nov', orderSub: 'In 25 days', waiting: 'You', waitingSub: 'Since Thu 15 Oct', action: 'send' },
  { sku: 'Chocolate drink 900g', comp: 'Shipper carton ×12', launch: '7 Dec', launchSub: 'W49', at: 1, note: 'Sizes in: 370 × 250 × 280 mm. No carton vendor quoted yet', orderBy: 'Mon 23 Nov', orderSub: 'In 32 days', waiting: 'Procurement', waitingSub: '6 days', action: 'nudge' },
  { sku: 'Instant noodles, pepper soup 70g', comp: 'Laminate film 70g', launch: '4 Jan 2027', launchSub: 'W01', at: 4, note: 'Order placed Tue 20 Oct, 600k packs. At factory W45', orderBy: 'Done', orderSub: 'Ordered on time', waiting: 'Nobody', action: 'ordered' },
  { sku: 'Instant noodles, pepper soup 70g', comp: 'Shipper carton ×40', launch: '4 Jan 2027', launchSub: 'W01', at: 0, note: 'Waiting for carton sizes from the packaging team', orderBy: 'Mon 14 Dec', orderSub: 'In 53 days', waiting: 'Packaging team', waitingSub: '3 days', action: 'nudge' },
]

export const leadTimes = [
  { name: 'Malt extract', code: 'RM-1042', src: 'Imported', unit: 't', sup: '4 wks', sea: '5 wks', port: '3 wks', portWas: 'was 2', road: '1 wk', total: '13 wks', safety: '8 wks', by: 'Kunle, imports', when: 'Today 09:40 · port delays at Apapa', whenTone: 'low' },
  { name: 'Cocoa powder', code: 'RM-1107', src: 'Imported', unit: 't', sup: '3 wks', sea: '4 wks', port: '2 wks', road: '1 wk', total: '10 wks', safety: '8 wks', by: 'Tola Ajayi', when: 'Mon 5 Oct' },
  { name: 'Tinplate cans 160g', code: 'PM-2210', src: 'Imported', unit: 'units', sup: '6 wks', sea: '5 wks', port: '2 wks', road: '1 wk', total: '14 wks', safety: '8 wks', by: 'Tola Ajayi', when: 'Mon 5 Oct' },
  { name: 'Shipper cartons, all SKUs', code: 'PM-2004', src: 'Local', unit: 'units', sup: '1 wk', sea: null, port: null, road: '2 days', total: '1 wk', safety: '2 wks', by: 'Tola Ajayi', when: 'Thu 1 Oct' },
  { name: 'Wheat flour', code: 'RM-1001', src: 'Local', unit: 't', sup: '4 days', sea: null, port: null, road: '1 day', total: '1 wk', safety: '2 wks', by: 'Tola Ajayi', when: 'Thu 1 Oct' },
  { name: 'Laminate film, noodles', code: 'PM-2301', src: 'Local', unit: 'units', sup: '2 wks', sea: null, port: null, road: '2 days', total: '2 wks', safety: '2 wks', by: 'Tola Ajayi', when: 'Thu 1 Oct' },
  { name: 'Palm olein', code: 'RM-1015', src: 'Local', unit: 't', sup: '10 days', sea: null, port: null, road: '2 days', total: '2 wks', safety: '2 wks', by: 'Tola Ajayi', when: 'Thu 1 Oct' },
]

export const rules = [
  { name: 'Staff pack window', value: '90 days before expiry', note: 'Batches enter the freshness review when they cross this line.' },
  { name: 'Freshness review horizon', value: '120 days', note: 'How far ahead the Next 120 days tab looks.' },
  { name: 'Repackaging', value: 'Only when damage is reported', note: 'Good product in a damaged carton. Compromised product can only be destroyed.' },
  { name: 'Safety level, local materials', value: '2 weeks of cover', note: 'Below this, the Cover cell turns amber.' },
  { name: 'Safety level, imported materials', value: '8 weeks of cover', note: 'Longer because sea, port and clearing add weeks.' },
  { name: 'Task overdue', value: 'After 18:00 on the due date', note: 'Overdue tasks show on the inventory team list and in Missed if the batch expires.' },
]

export const people = [
  { name: 'Adaeze Okafor', role: 'Head office planning', access: 'Sets rules and safety levels' },
  { name: 'Femi Bello', role: 'Demand planning', access: 'Routes batches, decides damage' },
  { name: 'Tola Ajayi', role: 'MRP team', access: 'Flags shortages, sets new SKU quantities' },
  { name: 'Amaka Nwosu', role: 'Inventory team, Onitsha', access: 'Confirms tasks, reports damage' },
  { name: 'Kunle Adebayo', role: 'Imports', access: 'Updates shipment stages and port times' },
  { name: 'Ade Bakare', role: 'Factory planning', access: 'Replies to flags, places orders' },
]

export const notifications = [
  { text: 'Malt extract runs out in W45 and has not been flagged to factory planning.', when: 'Today 08:20', to: 'materials' },
  { text: 'Cooking oil 1L, Kano: QA results are 2 days late.', when: 'Today 07:50', to: 'qa' },
  { text: 'Kano warehouse has not synced since 04:40.', when: 'Today 06:00', to: 'stock' },
]
