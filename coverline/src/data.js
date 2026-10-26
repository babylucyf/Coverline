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
  { name: 'Seasoning cubes 4g ×100', sku: 'SSN-004-CB', wh: 'Onitsha', cases: 0, cover: 0, life: null, lifeNote: 'No stock', status: 'out' },
  { name: 'Powdered milk 400g', sku: 'MLK-400-PD', wh: 'Abuja', cases: 0, cover: 0, life: null, lifeNote: 'No stock', status: 'out' },
  { name: 'Instant noodles, chicken 70g', sku: 'NDL-070-CH', wh: 'Kano', cases: 840, cover: 2.1, life: 142, lifeNote: 'Expires 13 Mar 2027', status: 'low' },
  { name: 'Custard powder 300g', sku: 'CST-300-VN', wh: 'Port Harcourt', cases: 460, cover: 3.2, life: 118, lifeNote: 'Staff pack window in 28 days', lifeTone: 'low', status: 'low' },
  { name: 'Tomato paste 70g', sku: 'TMP-070-SC', wh: 'Abuja', cases: 1120, cover: 4.6, life: 84, lifeNote: 'Pull for staff pack now', lifeTone: 'out', status: 'low' },
  { name: 'Malt drink 33cl ×24', sku: 'MLT-033-24', wh: 'Onitsha', cases: 1940, cover: 6.1, life: 95, lifeNote: 'Staff pack window in 5 days', lifeTone: 'low', status: 'low' },
  { name: 'Bottled water 75cl ×12', sku: 'WTR-075-12', wh: 'Ibadan', cases: 3950, cover: 8.7, life: 210, lifeNote: 'Expires 20 May 2027', status: 'safe' },
  { name: 'Chocolate drink 400g', sku: 'CHC-400-TN', wh: 'Lagos', cases: 2780, cover: 9.3, life: 103, lifeNote: 'Staff pack window in 13 days', lifeTone: 'low', status: 'safe' },
  { name: 'Cooking oil 1L', sku: 'OIL-001-VG', wh: 'Lagos', cases: 4480, cover: 10.2, life: 260, lifeNote: 'Expires 9 Jul 2027', status: 'safe' },
  { name: 'Instant noodles, onion 70g', sku: 'NDL-070-ON', wh: 'Ibadan', cases: 3300, cover: 11.0, life: 71, lifeNote: 'Pull for staff pack now', lifeTone: 'out', status: 'safe' },
  { name: 'Evaporated milk 160g', sku: 'MLK-160-EV', wh: 'Lagos', cases: 6200, cover: 12.4, life: 180, lifeNote: 'Expires 20 Apr 2027', status: 'safe' },
  { name: 'Corn flakes 350g', sku: 'CFL-350-OR', wh: 'Kano', cases: 5310, cover: 14.8, life: 164, lifeNote: 'Expires 4 Apr 2027', status: 'safe' },
]

// Freshness: staff pack window opens 90 days before expiry. Today is 22 Oct 2026.
export const batches = [
  { id: 'B-2408-11', name: 'Instant noodles, onion 70g', wh: 'Ibadan', cases: 3300, days: 71, expires: '1 Jan 2027', window: 'Window opened 3 Oct', decision: 'Staff pack', task: { tone: 'out', text: 'Waiting 3 days' } },
  { id: 'B-2409-09', name: 'Cooking oil 1L', wh: 'Kano', cases: 120, days: 74, expires: '4 Jan 2027', window: 'Window opened 6 Oct', decision: 'Destroy', task: { tone: 'safe', text: 'Done' } },
  { id: 'B-2407-22', name: 'Tomato paste 70g', wh: 'Abuja', cases: 1120, days: 84, expires: '14 Jan 2027', window: 'Window opened 16 Oct', decision: 'Staff pack', task: { tone: 'safe', text: 'Done' } },
  { id: 'B-2409-28', name: 'Corn flakes 350g', wh: 'Kano', cases: 210, days: 88, expires: '18 Jan 2027', window: 'Window opened 20 Oct', decision: 'Repackage', damaged: true, task: { tone: 'low', text: 'Waiting 2 days' } },
  { id: 'B-2408-30', name: 'Evaporated milk 160g', wh: 'Lagos', cases: 380, days: 92, expires: '22 Jan 2027', window: 'Window opens 24 Oct', decision: 'Staff pack', task: { tone: 'low', text: 'Waiting 1 day' } },
  { id: 'B-2409-03', name: 'Malt drink 33cl ×24', wh: 'Onitsha', cases: 640, days: 95, expires: '25 Jan 2027', window: 'Window opens 27 Oct', windowLong: 'Opens Mon 27 Oct, in 5 days', decision: null, task: { tone: 'neutral', text: 'Not decided' } },
  { id: 'B-2409-17', name: 'Chocolate drink 400g', wh: 'Lagos', cases: 900, days: 103, expires: '2 Feb 2027', window: 'Window opens 4 Nov', decision: 'Trade priority', task: { tone: 'low', text: 'Waiting 1 day' } },
  { id: 'B-2410-02', name: 'Custard powder 300g', wh: 'Port Harcourt', cases: 460, days: 118, expires: '17 Feb 2027', window: 'Window opens 19 Nov', windowLong: 'Opens Thu 19 Nov, in 28 days', decision: null, task: { tone: 'neutral', text: 'Not decided' } },
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
  { name: 'Malt extract', code: 'RM-1042', origin: 'Imported', lead: '12 wk lead', onHand: '18 t', cover: 1.4, coverTone: 'low',
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
    risk: { title: 'None', note: 'Includes 414 for repackaging', tone: 'low' } },
  { name: 'Wheat flour', code: 'RM-1001', origin: 'Local', lead: '1 wk lead', onHand: '220 t', cover: 4.2,
    cells: [[4.2], [3.2], [2.2], [4.8, 'in 140 t'], [3.8], [2.8], [5.1, 'in 120 t'], [4.1], [3.1], [2.1]], risk: { title: 'None' } },
  { name: 'Laminate film, noodles', code: 'PM-2301', origin: 'Local', lead: '2 wk lead', onHand: '1.2M packs', cover: 4.8,
    cells: [[4.8], [3.8], [2.8], [4.4, 'in 400k'], [3.4], [2.4], [4.0, 'in 400k'], [3.0], [2.0], [3.6, 'in 400k']], risk: { title: 'None' } },
  { name: 'Palm olein', code: 'RM-1015', origin: 'Local', lead: '2 wk lead', onHand: '140 t', cover: 5.5,
    cells: [[5.5], [4.5], [3.5], [2.5], [5.0, 'in 65 t'], [4.0], [3.0], [5.2, 'in 55 t'], [4.2], [3.2]], risk: { title: 'None' } },
]

export const safety = { Local: 2, Imported: 8 }

export const flagsSent = [
  { material: 'Cocoa powder', product: 'Chocolate drink 400g', qty: '20 t', by: 'Fri 13 Nov', sent: 'Wed 21 Oct', reply: 'Clearing agent asked to fast-track the W47 shipment. Local blender quote requested as a backup.', who: 'Factory planning, Lagos', status: { tone: 'low', text: 'Expediting' } },
  { material: 'Shipper cartons', product: 'Corn flakes 350g repack', qty: '90 cartons', by: 'Mon 26 Oct', sent: 'Tue 20 Oct', reply: 'Order placed with a local supplier. Delivery Fri 23 Oct.', who: 'Factory planning, Lagos', status: { tone: 'safe', text: 'Order placed' } },
]

export const qa = [
  { id: 'B-2408-02', name: 'Cooking oil 1L', loc: 'Kano', locSub: 'Warehouse', cases: 400, reason: 'Testing warehouse stock', reasonSub: 'Routine shelf check', type: 'Warehouse stock', held: 9, heldTone: 'out', due: 'Tue 20 Oct', dueSub: '2 days late', dueTone: 'out', stage: { tone: 'out', text: 'Awaiting sign-off' }, next: 'Back to Kano stock', nextSub: 'Trade priority task waits', chase: true },
  { id: 'B-2410-21', name: 'Malt drink 33cl ×24', loc: 'Factory', locSub: 'Line 2', cases: 2400, reason: 'Testing factory output', reasonSub: 'New production run', type: 'Factory output', held: 6, heldTone: 'low', due: 'Fri 23 Oct', dueSub: 'Tomorrow', dueTone: 'low', stage: { tone: 'low', text: 'In lab' }, next: 'Dispatch week 44', nextSub: 'Planned in DOR' },
  { id: 'B-2410-03', name: 'Chocolate drink 400g', loc: 'Factory', locSub: 'Line 1', cases: 1800, reason: 'Testing factory output', reasonSub: 'New production run', type: 'Factory output', held: 4, due: 'Tue 27 Oct', dueSub: 'In 5 days', stage: { tone: 'low', text: 'In lab' }, next: 'Dispatch week 44', nextSub: 'Planned in DOR' },
  { id: 'B-2409-15', name: 'Corn flakes 350g', loc: 'Lagos', locSub: 'Warehouse', cases: 85, reason: 'Pulled for staff pack by mistake', reasonSub: 'Batch not in the window', type: 'Staff pack by mistake', held: 3, due: 'Mon 26 Oct', dueSub: 'In 4 days', stage: { tone: 'neutral', text: 'Awaiting sign-off' }, next: 'Back to trade', nextSub: 'Removed from staff pack' },
  { id: 'B-2410-18', name: 'Instant noodles, onion 70g', loc: 'Factory', locSub: 'Line 3', cases: 5600, reason: 'Testing factory output', reasonSub: 'New production run', type: 'Factory output', held: 2, due: 'Mon 26 Oct', dueSub: 'In 4 days', stage: { tone: 'neutral', text: 'Sampling' }, next: 'Dispatch week 44', nextSub: 'Planned in DOR' },
  { id: 'B-2410-09', name: 'Custard powder 300g', loc: 'Lagos', locSub: 'Warehouse', cases: 24, reason: 'Damage check', reasonSub: 'Warehouse marked "Not sure"', type: 'Damage check', held: 1, due: 'Sat 24 Oct', dueSub: 'In 2 days', stage: { tone: 'neutral', text: 'Sampling' }, next: 'Freshness review', nextSub: 'Destroy or repackage' },
]
