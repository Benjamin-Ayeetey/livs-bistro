from PIL import Image
from pathlib import Path
out=Path('public/media'); out.mkdir(parents=True,exist_ok=True)
for source in Path('assets').rglob('*'):
 if source.suffix.lower() not in ['.png','.jpeg','.jpg']: continue
 name=source.stem.lower()
 im=Image.open(source)
 for width in [640,1120]:
  resized=im.copy(); resized.thumbnail((width,width*2)); resized.save(out/f'{name}-{width}.webp','WEBP',quality=84,method=6)

