#!/usr/bin/env python3
"""Build plugins/ from src/ (embedding third-party data), then write index.json with SHA-256 checksums."""
import json, hashlib, os, re, sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXT=sys.argv[1] if len(sys.argv)>1 else os.environ.get('CC_EXT','')
def build_src():
    for f in sorted(os.listdir(os.path.join(ROOT,'src'))):
        if not f.endswith('.js'): continue
        s=open(os.path.join(ROOT,'src',f),encoding='utf-8').read()
        if '/*@@QRLIB@@*/' in s:
            lib=open(os.path.join(EXT,'qrg/js/dist/qrcode.js'),encoding='utf-8').read()
            s=s.replace('/*@@QRLIB@@*/',lib)
        if '/*@@KIT@@*/' in s:
            s=s.replace('/*@@KIT@@*/',open(os.path.join(ROOT,'tools','kiticons.data.js'),encoding='utf-8').read()+open(os.path.join(ROOT,'tools','kit.inc.js'),encoding='utf-8').read())
        if '/*@@ICONS@@*/' in s:
            s=s.replace('/*@@ICONS@@*/',open(os.path.join(ROOT,'tools','icons.data.js'),encoding='utf-8').read())
        open(os.path.join(ROOT,'plugins',f),'w',encoding='utf-8').write(s)
def head(code):
    m=re.search(r'==CocoaCanvas Plugin==([\s\S]*?)==/CocoaCanvas Plugin==',code);o={}
    for l in m.group(1).split('\n'):
        x=re.search(r'@(\w+)\s+(.+)',l)
        if x:o[x.group(1)]=x.group(2).strip()
    return o
if EXT: build_src()
order=['apple-design-kit','google-design-kit','icons','placeholders','patterns','noise','qr-code','lorem-ipsum']
plugins=[]
for f in sorted(os.listdir(os.path.join(ROOT,'plugins')),key=lambda f:(order.index(f[:-3]) if f[:-3] in order else 99,f)):
    if not f.endswith('.js'):continue
    code=open(os.path.join(ROOT,'plugins',f),encoding='utf-8').read();h=head(code)
    e={'id':h['id'],'name':h.get('name',h['id']),'version':h.get('version','1'),'author':h.get('author',''),'description':h.get('description',''),
       'access':'full' if h.get('access','').lower()=='full' else 'safe','permissions':h.get('permissions','').split(),'icon':h.get('icon',''),'color':h.get('color',''),
       'path':'plugins/'+f,'sha256':hashlib.sha256(code.encode('utf-8')).hexdigest(),'size':len(code.encode('utf-8'))}
    for k in ('name_ru','description_ru'):
        if k in h:e[k]=h[k]
    plugins.append(e)
json.dump({'schema':1,'name':'CocoaSuite plugins for CocoaCanvas','plugins':plugins},open(os.path.join(ROOT,'index.json'),'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('\n'.join(f"{p['id']:20} {p['size']:>9} {p['sha256'][:12]}" for p in plugins))
