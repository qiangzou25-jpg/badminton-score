const Storage = {
    get() { return JSON.parse(localStorage.getItem('m') || '[]'); },
    set(d) { localStorage.setItem('m', JSON.stringify(d)); }
};
let cur = null;

function show(p) {
    document.querySelectorAll('.page').forEach(e => e.classList.remove('active'));
    document.getElementById('p' + p).classList.add('active');
    if (p === 1) load();
}

function load() {
    const m = Storage.get();
    document.getElementById('list').innerHTML = m.length ? m.map(x => `
        <div class="match" onclick="openM('${x.id}')">
            <div><b>${x.t}</b><br><small>${x.d}</small></div>
            <span style="color:${x.s == 'ongoing' ? '#f44' : '#999'}">${x.s == 'ongoing' ? '进行中' : '已结束'}</span>
        </div>
    `).join('') : '<p style="text-align:center;color:#999">暂无比赛</p>';
}

function init() {
    const d = document.getElementById('players');
    d.innerHTML = '';
    for (let i = 1; i <= 4; i++) {
        d.innerHTML += `<div class="player"><span>${i}号</span><input id="p${i}" placeholder="姓名"></div>`;
    }
}

function create() {
    const t = document.getElementById('t1').value || '比赛';
    const d = document.getElementById('t2').value || new Date().toISOString().split('T')[0];
    const ps = [1, 2, 3, 4].map(i => document.getElementById('p' + i).value).filter(n => n);
    if (ps.length < 4) { alert('请填写4名选手'); return; }
    const sh = [...ps].sort(() => Math.random() - 0.5);
    cur = {
        id: Date.now() + '',
        t, d, ps,
        sc: [
            { n: 1, t1: [sh[0], sh[1]], t2: [sh[2], sh[3]], s1: 0, s2: 0 },
            { n: 2, t1: [sh[0], sh[2]], t2: [sh[1], sh[3]], s1: 0, s2: 0 },
            { n: 3, t1: [sh[0], sh[3]], t2: [sh[1], sh[2]], s1: 0, s2: 0 }
        ],
        s: 'ongoing'
    };
    showSch();
}

function showSch() {
    document.getElementById('sch').innerHTML = cur.sc.map(g => `
        <div class="game">
            <div>第${g.n}局</div>
            <div><span class="tag">${g.t1[0]}</span><span class="tag">${g.t1[1]}</span></div>
            <div>VS</div>
            <div><span class="tag">${g.t2[0]}</span><span class="tag">${g.t2[1]}</span></div>
        </div>
    `).join('');
    show(3);
}

function start() {
    const m = Storage.get();
    m.unshift(cur);
    Storage.set(m);
    openM(cur.id);
}

function openM(id) {
    const m = Storage.get();
    cur = m.find(x => x.id == id);
    if (!cur) return;
    cur.s == 'ongoing' ? showScore() : showRes();
}

function showScore() {
    document.getElementById('mt').innerText = cur.t + ' ' + cur.d;
    document.getElementById('games').innerHTML = cur.sc.map((g, i) => `
        <div class="game" onclick="edit(${i})">
            <div><span class="tag">${g.t1[0]}</span><span class="tag">${g.t1[1]}</span></div>
            <div class="score">${g.s1} : ${g.s2}</div>
            <div><span class="tag">${g.t2[0]}</span><span class="tag">${g.t2[1]}</span></div>
        </div>
    `).join('');
    show(4);
}

function edit(i) {
    const g = cur.sc[i];
    const s1 = prompt(g.t1[0] + '+' + g.t1[1] + '得分', g.s1);
    if (s1 === null) return;
    const s2 = prompt(g.t2[0] + '+' + g.t2[1] + '得分', g.s2);
    if (s2 === null) return;
    cur.sc[i].s1 = parseInt(s1) || 0;
    cur.sc[i].s2 = parseInt(s2) || 0;
    const m = Storage.get();
    const idx = m.findIndex(x => x.id == cur.id);
    if (idx > -1) m[idx] = cur;
    Storage.set(m);
    showScore();
}

function finish() {
    if (!confirm('结束比赛？')) return;
    cur.s = 'finished';
    const m = Storage.get();
    const idx = m.findIndex(x => x.id == cur.id);
    if (idx > -1) m[idx] = cur;
    Storage.set(m);
    showRes();
}

function showRes() {
    const st = {};
    cur.ps.forEach(p => st[p] = { n: p, w: 0, l: 0, t: 0 });
01:01
回复 用户525192: 

cur.sc.forEach(g => {
const w1 = g.s1 > g.s2;
g.t1.forEach(p => { st[p].t += g.s1; w1 ? st[p].w++ : st[p].l++; });
g.t2.forEach(p => { st[p].t += g.s2; !w1 ? st[p].w++ : st[p].l++; });
});
const rk = Object.values(st).sort((a, b) => b.w - a.w || b.t - a.t);
document.getElementById('rank').innerHTML = rk.map(r => <div class="card"> <div><span style="background:#1989fa;color:#fff;padding:2px 8px;border-radius:4px">胜${r.w}</span> <span style="background:#f44;color:#fff;padding:2px 8px;border-radius:4px">负${r.l}</span></div> <div style="color:#1989fa;margin:8px 0">${r.n}</div> <div style="color:#999;font-size:12px">总得分${r.t}</div> </div>).join('');
document.getElementById('res').innerHTML = cur.sc.map(g => <div class="game"> <span class="tag">${g.t1[0]}</span><span class="tag">${g.t1[1]}</span> <span class="score" style="color:${g.s1 > g.s2 ? '#f44' : '#1989fa'}">${g.s1}</span> : <span class="score" style="color:${g.s2 > g.s1 ? '#f44' : '#1989fa'}">${g.s2}</span> <span class="tag">${g.t2[0]}</span><span class="tag">${g.t2[1]}</span> </div>).join('');
show(5);
}

document.getElementById('t2').value = new Date().toISOString().split('T')[0];
init();
load();
