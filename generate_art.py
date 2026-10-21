"""Regenerates the self-contained illustration placeholders. Python 3, stdlib only.
Every occurrence of the mother uses the exact same vector portrait.
"""
from pathlib import Path
import random, json, math
from html import escape
ROOT = Path(__file__).parent
OUT = ROOT/'assets'/'profiles'
OUT.mkdir(parents=True, exist_ok=True)

# These visual features never change: short midnight-blue bob with white streak,
# oversized turquoise cat-eye glasses, star earrings, and magenta cardigan.
def mom(x=0, y=0, scale=1):
    return f'''<g transform="translate({x} {y}) scale({scale})">
    <ellipse cx="130" cy="350" rx="128" ry="30" fill="#16112c" opacity=".16"/>
    <path d="M 12 350 Q 25 223 103 213 L 157 213 Q 235 221 250 350 Z" fill="#952952"/>
    <path d="M 77 249 Q 130 276 184 249 L 204 350 L 56 350Z" fill="#c23e6c"/>
    <path d="M 101 224 L 112 270 L 130 291 L 149 270 L 161 224" fill="#eaa488"/>
    <path d="M 130 263 L 113 281 L 130 301 L 148 281Z" fill="#f8d6a8"/>
    <path d="M 43 176 C 25 100 39 31 105 17 C 162 1 219 28 219 115 L 218 215 Q 189 241 165 208 L 83 208 Q 49 234 43 176Z" fill="#202139"/>
    <ellipse cx="130" cy="129" rx="72" ry="88" fill="#f2b797"/>
    <path d="M 51 99 Q 45 14 125 20 Q 209 12 210 107 Q 182 102 156 66 Q 125 99 51 99Z" fill="#202139"/>
    <path d="M 93 26 Q 82 55 74 93 Q 89 90 101 81 Q 111 47 119 23Z" fill="#f4e9d9"/>
    <path d="M 54 108 Q 33 153 57 210 Q 76 219 77 188 L 78 101Z" fill="#202139"/>
    <path d="M 207 102 Q 234 164 211 213 Q 192 219 185 183 L 186 110Z" fill="#202139"/>
    <ellipse cx="57" cy="143" rx="14" ry="23" fill="#eeaa90"/>
    <ellipse cx="203" cy="143" rx="14" ry="23" fill="#eeaa90"/>
    <path d="M 81 124 Q 104 114 122 123 L 127 145 Q 109 164 84 148Z" fill="#eaf9f5" fill-opacity=".23" stroke="#1ed5c4" stroke-width="8" stroke-linejoin="round"/>
    <path d="M 138 123 Q 160 113 180 123 L 176 148 Q 153 164 135 145Z" fill="#eaf9f5" fill-opacity=".23" stroke="#1ed5c4" stroke-width="8" stroke-linejoin="round"/>
    <path d="M 123 132 L 138 132" stroke="#1ed5c4" stroke-width="7" stroke-linecap="round"/>
    <path d="M 81 121 L 64 114 M 180 121 L 196 114" stroke="#1ed5c4" stroke-width="7" stroke-linecap="round"/>
    <circle cx="103" cy="136" r="5.1" fill="#26313e"/><circle cx="157" cy="136" r="5.1" fill="#26313e"/>
    <path d="M 130 141 L 124 159 L 135 161" fill="none" stroke="#be806d" stroke-width="3" stroke-linecap="round"/>
    <path d="M 111 180 Q 130 193 150 178" fill="none" stroke="#a6475a" stroke-width="5" stroke-linecap="round"/>
    <path d="M 59 178 l 5 12 12 1 -9 8 2 12 -10 -6 -10 6 2 -12 -9 -8 12 -1Z" fill="#ffd875" stroke="#f1be4b" stroke-width="2"/>
    <path d="M 202 178 l 5 12 12 1 -9 8 2 12 -10 -6 -10 6 2 -12 -9 -8 12 -1Z" fill="#ffd875" stroke="#f1be4b" stroke-width="2"/>
    <path d="M 64 264 Q 37 291 37 339" stroke="#dc678d" stroke-width="6" fill="none"/>
    <path d="M 194 264 Q 225 290 223 339" stroke="#dc678d" stroke-width="6" fill="none"/>
    </g>'''

def svg_root(inner, bg1, bg2, scene, seed=0):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 650" width="600" height="650">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="{bg1}"/><stop offset="1" stop-color="{bg2}"/></linearGradient>
    <linearGradient id="light" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".29"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="13"/></filter></defs>
    <rect width="600" height="650" fill="url(#bg)"/>{scene}
    <path d="M 0 0 H 600 V 130 Q 310 190 0 92Z" fill="url(#light)"/>
    {inner}<rect x="0" y="0" width="600" height="650" fill="none" stroke="#ffffff" stroke-opacity=".13" stroke-width="12"/>
    </svg>'''

def scenery(style, rand):
    if style=='cafe':
        return '''<rect x="38" y="92" width="215" height="380" rx="18" fill="#e9dace" fill-opacity=".50"/><rect x="53" y="110" width="183" height="335" rx="7" fill="#b6d2c3"/>
        <path d="M 58 318 H 231 M 140 116 V 446" stroke="#fdf4e8" stroke-width="15"/><path d="M 40 460 H 270" stroke="#8d6c66" stroke-width="24"/>
        <ellipse cx="500" cy="558" rx="126" ry="25" fill="#543a4a" opacity=".18"/><rect x="446" y="390" width="120" height="152" rx="7" fill="#a37b6a" opacity=".36"/>'''
    if style=='park':
        return '''<circle cx="480" cy="150" r="85" fill="#ffe6a6" opacity=".62"/><path d="M0 435 Q 124 356 270 426 T600 398 V650 H0Z" fill="#92b99d" opacity=".75"/>
        <path d="M0 527 Q177 488 289 541 T600 511 V650H0Z" fill="#6a9a80" opacity=".58"/><path d="M 90 430 V190" stroke="#715e5c" stroke-width="19"/>
        <circle cx="88" cy="200" r="115" fill="#6d987e"/><circle cx="146" cy="164" r="79" fill="#8db59a"/>'''
    if style=='night':
        return '''<circle cx="98" cy="157" r="76" fill="#f4cdb2" opacity=".12" filter="url(#soft)"/>
        <rect x="18" y="280" width="110" height="372" rx="9" fill="#28234e" opacity=".43"/><rect x="492" y="174" width="90" height="430" rx="6" fill="#181b3b" opacity=".42"/>
        <g fill="#fff4bd" opacity=".7"><circle cx="60" cy="336" r="7"/><circle cx="64" cy="420" r="7"/><circle cx="521" cy="254" r="9"/><circle cx="553" cy="340" r="7"/><circle cx="537" cy="417" r="7"/></g>'''
    if style=='beach':
        return '''<circle cx="500" cy="115" r="78" fill="#fef5bb" opacity=".74"/><path d="M 0 380 Q 290 364 600 399 V650 H0Z" fill="#67b7ca" opacity=".6"/>
        <path d="M 0 480 Q 300 456 600 493 V650H0Z" fill="#dbb78e" opacity=".83"/><path d="M 0 435 Q 260 421 600 447" stroke="#fdf7df" stroke-width="13" opacity=".65" fill="none"/>'''
    if style=='home':
        return '''<rect x="28" y="118" width="204" height="245" rx="8" fill="#f6d7c7" opacity=".48"/>
        <path d="M 50 310 V160 H205 V310Z" fill="#faece4" opacity=".57"/><path d="M 120 160 V310 M 50 238 H205" stroke="#d4b49f" stroke-width="12"/>
        <rect x="0" y="528" width="600" height="120" fill="#ba9189" opacity=".32"/><circle cx="517" cy="183" r="55" fill="#ffe4bf" opacity=".57"/>'''
    return '''<rect x="35" y="100" width="170" height="320" rx="12" fill="#fff" opacity=".18"/>
        <rect x="416" y="84" width="149" height="402" rx="15" fill="#fff" opacity=".15"/>
        <circle cx="507" cy="120" r="89" fill="#fff" opacity=".15"/>'''

def person(seed):
    r = random.Random(seed * 1117 + 35)
    # A sizable stylistic mix; in particular, no ordinary person shares the mom's signature outfit, glasses or bob streak.
    skins=['#edb48f','#f3c9ad','#cf9271','#9f634f','#dba17e','#794c42','#ecc3aa','#b57861']
    hair=['#382d33','#a4653d','#1e2536','#d3a46a','#583e37','#e8cda7','#6e4749','#2b242c','#bc6b48']
    top=['#546c9b','#d69b75','#6a7d67','#ad7561','#7a6591','#d4ac82','#486d78','#c77679','#688a88']
    skin=r.choice(skins); ink=r.choice(hair); shirt=r.choice(top)
    cx=r.randint(256,344); cy=r.randint(245,280); htype=r.randrange(6)
    # Hair/background behind head, neck and body
    behind=''
    if htype in (0,3,4):
        behind=f'<path d="M {cx-102} {cy-22} Q {cx-114} {cy-158} {cx} {cy-158} Q {cx+116} {cy-145} {cx+101} {cy-2} L {cx+119} {cy+208} L {cx-126} {cy+209}Z" fill="{ink}"/>'
    else:
        behind=f'<ellipse cx="{cx}" cy="{cy-28}" rx="107" ry="137" fill="{ink}"/>'
    shoulders=f'<path d="M {cx-212} 650 Q {cx-188} {cy+190} {cx-64} {cy+164} L {cx+63} {cy+164} Q {cx+196} {cy+195} {cx+220} 650Z" fill="{shirt}"/>'
    neck=f'<path d="M {cx-38} {cy+80} L {cx-46} {cy+168} Q {cx} {cy+216} {cx+50} {cy+164} L {cx+36} {cy+84}Z" fill="{skin}"/>'
    face=f'<ellipse cx="{cx}" cy="{cy}" rx="86" ry="112" fill="{skin}"/>'
    ears=f'<ellipse cx="{cx-84}" cy="{cy+11}" rx="13" ry="23" fill="{skin}"/><ellipse cx="{cx+84}" cy="{cy+11}" rx="13" ry="23" fill="{skin}"/>'
    hair_front=(
        f'<path d="M {cx-83} {cy-33} Q {cx-72} {cy-144} {cx+10} {cy-127} Q {cx+104} {cy-127} {cx+88} {cy-12} Q {cx+57} {cy-104} {cx+15} {cy-88} Q {cx-20} {cy-55} {cx-83} {cy-33}Z" fill="{ink}"/>' if htype in (0,3,4) else
        f'<path d="M {cx-85} {cy-34} Q {cx-92} {cy-138} {cx+15} {cy-131} Q {cx+111} {cy-130} {cx+86} {cy-16} Q {cx+40} {cy-97} {cx-16} {cy-85} Q {cx-51} {cy-47} {cx-85} {cy-34}Z" fill="{ink}"/>'
    )
    detail=''
    if htype==2:
        detail=f'<path d="M {cx-64} {cy-72} Q {cx+8} {cy-166} {cx+91} {cy-85}" stroke="{ink}" stroke-width="35" stroke-linecap="round" fill="none"/>'
    if htype==5:
        detail=f'<path d="M {cx+40} {cy-104} Q {cx+110} {cy-77} {cx+99} {cy+8}" stroke="{ink}" stroke-width="29" fill="none"/>'
    mouth_style=r.randrange(3)
    mouth = f'<path d="M{cx-21} {cy+62} Q{cx} {cy+79 if mouth_style<2 else cy+65} {cx+23} {cy+58}" stroke="#934e4a" stroke-width="4" fill="none" stroke-linecap="round"/>'
    eyes=f'<path d="M {cx-55} {cy+5} Q {cx-37} {cy-4} {cx-21} {cy+6} M {cx+19} {cy+6} Q {cx+40} {cy-4} {cx+55} {cy+5}" stroke="#473d3d" stroke-width="4.5" fill="none" stroke-linecap="round"/><circle cx="{cx-36}" cy="{cy+7}" r="3" fill="#292937"/><circle cx="{cx+36}" cy="{cy+7}" r="3" fill="#292937"/>'
    nose=f'<path d="M {cx} {cy+6} l -5 29 l 10 4" stroke="#9b685a" stroke-width="3" opacity=".56" fill="none"/>'
    accessory=''
    if r.random()<.37:
        accessory=f'<circle cx="{cx-90}" cy="{cy+39}" r="7" fill="#f3dfba"/><circle cx="{cx+90}" cy="{cy+39}" r="7" fill="#f3dfba"/>'
    if r.random()<.30:
        accessory+=f'<path d="M {cx-62} {cy+178} Q {cx} {cy+226} {cx+62} {cy+178}" stroke="#f0ddc6" stroke-width="5" fill="none"/>'
    special=''
    if r.random()<.32:
        special=f'<path d="M {cx-212} 610 Q {cx-120} {cy+226} {cx-80} {cy+177}" stroke="#fff" opacity=".25" stroke-width="8" fill="none"/>'
    # foreground portrait intentionally distinct from mom in age, clothing, hair and especially glasses
    return behind+shoulders+neck+ears+face+hair_front+detail+eyes+nose+mouth+accessory+special, cx, cy

BGS=[('#f6cebf','#ca8c9e'),('#a4d9dc','#618cac'),('#efcc9a','#af8693'),('#bfd2b9','#718ea4'),('#cdb8e6','#897aa9'),('#f7b9bd','#c0849a'),('#a8c9c8','#b4ae8e'),('#a0b1d4','#494b77')]
SCENES=['cafe','park','home','night','beach','studio']
records={'normal':[], 'background':[], 'frame':[], 'mirror':[], 'direct':[]}

for n in range(1, 65):
    r=random.Random(n*61)
    colors=BGS[n%len(BGS)]
    scene=scenery(SCENES[n%len(SCENES)],r)
    figure,cx,cy=person(n)
    file=f'n{n:03d}.svg'
    (OUT/file).write_text(svg_root(figure,*colors,scene,n),encoding='utf-8')
    records['normal'].append({'file':file,'persona':n})

for mode, total in [('background',28),('frame',20),('mirror',20)]:
    for k in range(1,total+1):
        # Opposite side of the main person; ground the marker placement on the actual mother's face center.
        person_id=(k*7+11)%64+1
        figure,cx,cy=person(person_id)
        col=BGS[person_id%len(BGS)]
        bg=scenery(SCENES[person_id%len(SCENES)],random.Random(k))
        left = k%2==0
        if mode=='background':
            scale=.48 if k%4 else .42
            x=12 if left else 465
            y=180 if k%3 else 200
            inserted=mom(x,y,scale)
            mx=(x+130*scale)/6
            my=(y+132*scale)/6.5
            illustration=inserted+figure
            note='媽媽躲在照片左側的背景' if left else '媽媽躲在照片右側的背景'
        else:
            scale=.43 if k%3 else .39
            x=20 if left else 465
            y=155
            if mode=='frame':
                surround=f'<rect x="{x-9}" y="{y-18}" width="{260*scale+18:.1f}" height="{350*scale+30:.1f}" rx="7" fill="#654b54" stroke="#f7e3b2" stroke-width="12"/>'
                note='媽媽竟然在牆上的相框裡'
            else:
                surround=f'<rect x="{x-9}" y="{y-18}" width="{260*scale+18:.1f}" height="{350*scale+30:.1f}" rx="46" fill="#a5cfdf" stroke="#e7f0f7" stroke-width="12"/>'
                note='媽媽藏在後方鏡子的反射裡'
            inserted=surround+mom(x,y,scale)
            mx=(x+130*scale)/6
            my=(y+132*scale)/6.5
            illustration=inserted+figure
        file=f'{mode[0]}{k:03d}.svg' if mode!='mirror' else f'mr{k:03d}.svg' # no collisions: b, f, mr
        (OUT/file).write_text(svg_root(illustration,*col,bg,person_id),encoding='utf-8')
        records[mode].append({'file':file,'persona':person_id,'spot':{'x':round(mx,1),'y':round(my,1)},'reason':note})

for k in range(1,9):
    colors=BGS[k%len(BGS)]
    bg=scenery(SCENES[k%len(SCENES)],random.Random(k))
    x,y,scale=144,92,1.2
    file=f'mom{k:02d}.svg'
    (OUT/file).write_text(svg_root(mom(x,y,scale),*colors,bg,k),encoding='utf-8')
    records['direct'].append({'file':file, 'spot':{'x':round((x+130*scale)/6,1),'y':round((y+132*scale)/6.5,1)},'reason':'就是媽媽本人！'})

(ROOT/'art-data.js').write_text('window.ART_DATA = '+json.dumps(records,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
# Full mother illustration for cover/branding
(ROOT/'assets'/'mom.svg').write_text(svg_root(mom(140,90,1.25),'#f0acc8','#8074c8',scenery('home',random.Random(3))),encoding='utf-8')
print('created',sum(len(v) for v in records.values()),'illustrations')
