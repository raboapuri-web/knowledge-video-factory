#!/usr/bin/env python3
"""Yodan Gakkai blue cat: deterministic cutout rig asset generator.

Design is manually reconstructed as clean vector artwork from the user's cat
reference; NOT an automatic extraction of its original hidden illustration layers.
All output pieces use the same 800x960 coordinate system and alpha background.
"""
import json
import io
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import cairosvg

W,H=800,960
BLUE="#3288B4"; DARKBLUE="#12699A"; WHITE="#FCFCF6"
BLACK="#12171C"; PINK="#F6CABF"; CREAM="#FFF6DE"
INK="stroke='#12171C' stroke-width='8' stroke-linejoin='round' stroke-linecap='round'"
SW="stroke='#12171C' stroke-width='6' stroke-linejoin='round' stroke-linecap='round'"

# All paths are full-frame, independently alpha-rendered SVG layers.
# Rear layers first. Eyes, glasses and expression sprites are separately replaceable.
ART={
"tail":f"""
<path d="M516 665 C618 698 690 671 677 565 C673 526 625 536 629 577 C636 633 589 623 544 585 Z" fill="{BLUE}" {INK}/>
<path d="M611 653 C633 634 650 609 655 585 M654 550 C668 556 676 572 677 591 M564 677 Q593 657 610 652" fill="none" stroke="{WHITE}" stroke-width="30"/>
<path d="M516 665 C618 698 690 671 677 565 C673 526 625 536 629 577 C636 633 589 623 544 585" fill="none" {INK}/>""",
"body":f"""
<path d="M314 542 C245 559 243 681 249 751 Q245 819 283 850
Q305 873 362 853 Q395 886 461 859 Q538 841 530 762
C528 646 515 560 460 544 Z" fill="{BLUE}" {INK}/>
<path d="M328 584 C296 613 293 675 297 746 C296 814 322 845 358 832
Q412 874 473 830 C502 784 474 714 472 673
C458 634 435 609 427 584 Z" fill="{WHITE}" />
<path d="M251 772 Q258 821 284 853 M496 813 Q513 843 468 862" stroke="{DARKBLUE}" stroke-width="14" fill="none" />""",
"foot_left":f"""<path d="M285 832 Q250 862 248 896 Q252 920 293 920
L348 913 Q365 901 353 873 L329 838 Z" fill="{WHITE}" {INK}/>
<path d="M278 907 l0 13 M298 910 l0 11" fill="none" {SW}/>""",
"foot_right":f"""<path d="M453 839 L487 829 Q533 851 548 890
Q559 917 525 922 L463 918 Q430 913 434 889 Z" fill="{WHITE}" {INK}/>
<path d="M514 907 l3 14 M493 909 l1 12" fill="none" {SW}/>""",
"arm_left_base":f"""<path d="M292 581 Q233 628 242 691 Q244 732 276 737
Q305 731 318 699 L327 616 Z" fill="{BLUE}" {INK}/>
<path d="M274 680 Q254 692 255 716 Q260 742 287 733
Q312 718 310 689 Z" fill="{WHITE}" {SW}/>""",
"arm_right_base":f"""<path d="M478 585 Q549 628 550 716 Q548 752 523 750
Q493 742 477 707 Z" fill="{BLUE}" {INK}/>
<path d="M503 703 Q511 681 535 695 Q559 715 538 743 Q517 754 497 730 Z" fill="{WHITE}" {SW}/>""",
"head":f"""
<!-- large, round original-style face and tall asymmetrical triangular ears -->
<path d="M220 346 Q208 261 212 180 Q217 131 234 99
Q259 93 326 182 Q390 171 440 180
Q509 100 537 108 Q558 177 563 256
Q600 328 581 417 Q571 520 485 568
Q389 608 288 554 Q208 504 203 419 Q193 377 220 346 Z" fill="{BLUE}" {INK}/>
<path d="M234 152 Q255 156 302 218 Q256 213 226 242 Z" fill="{PINK}" {SW}/>
<path d="M525 156 Q502 161 464 219 Q500 209 542 241 Z" fill="{PINK}" {SW}/>
<path d="M242 216 Q258 192 275 223 L251 239 M517 210 Q499 191 481 221 L510 239" fill="{WHITE}" stroke="{BLACK}" stroke-width="5"/>
<!-- three dark forehead stripes, blue cheek bars -->
<path d="M334 185 Q339 219 344 237 M388 181 Q389 216 391 235 M438 190 Q428 219 424 237" fill="none" stroke="{DARKBLUE}" stroke-width="17" stroke-linecap="round"/>
<path d="M232 403 L277 415 M517 412 L553 397" stroke="{DARKBLUE}" stroke-width="13" stroke-linecap="round"/>
<!-- white muzzle and neck are fixed, not redrawn per expression -->
<path d="M216 392 Q245 374 294 393 Q311 411 334 432
Q395 393 464 423 Q521 394 560 401
Q580 468 526 524 Q475 572 393 572 Q297 569 240 520
Q205 477 216 392 Z" fill="{WHITE}"/>
<path d="M312 316 Q326 308 338 314 M437 313 Q450 307 461 319" fill="none" stroke="{WHITE}" stroke-width="16" stroke-linecap="round"/>
<path d="M214 428 L170 409 M215 453 L156 454 M222 479 L171 499
M563 427 L610 406 M565 454 L627 450 M560 481 L607 501" fill="none" stroke="{BLACK}" stroke-width="5" stroke-linecap="round"/>""",
"glasses":f"""<circle cx="315" cy="384" r="79" fill="none" {INK}/>
<circle cx="472" cy="386" r="79" fill="none" {INK}/>
<path d="M391 380 Q396 372 400 381 M239 358 L211 358 M549 358 L580 351" fill="none" {SW}/>""",
}
# Eye area drawn *under* glasses; mouth on muzzle; 3 expressive sprite variants.
EYES={
"jito":f"""
<path d="M261 389 Q314 404 367 380 L367 409 Q318 450 267 415 Z" fill="{WHITE}"/>
<path d="M423 389 Q472 402 522 382 L522 412 Q468 449 425 415 Z" fill="{WHITE}"/>
<path d="M274 384 Q322 402 358 378 M434 383 Q479 401 516 381" stroke="{BLACK}" stroke-width="8" fill="none"/>
<ellipse cx="346" cy="411" rx="13" ry="24" fill="{BLACK}"/>
<ellipse cx="491" cy="410" rx="13" ry="24" fill="{BLACK}"/>
<path d="M385 476 q12 -11 25 0 q-13 14 -25 0 M395 482 q-11 20 -27 2 M396 482 q14 19 30 0" fill="none" {SW}/>""",
"niyari":f"""
<path d="M261 385 Q318 400 367 372 L369 412 Q310 450 266 418 Z
M420 385 Q473 400 522 371 L523 414 Q470 453 424 416 Z" fill="{WHITE}"/>
<path d="M270 377 Q323 402 363 370 M430 379 Q477 397 516 368" fill="none" stroke="{BLACK}" stroke-width="8"/>
<ellipse cx="343" cy="407" rx="13" ry="24" fill="{BLACK}"/><ellipse cx="490" cy="407" rx="13" ry="24" fill="{BLACK}"/>
<path d="M376 482 Q413 520 443 474 Q412 500 376 482 Z" fill="{BLACK}"/>
<path d="M398 501 Q417 506 431 491" fill="none" stroke="{WHITE}" stroke-width="6"/>""",
"akire":f"""
<path d="M264 394 Q312 385 364 390 L366 424 Q318 442 264 419 Z
M423 394 Q469 386 520 389 L522 421 Q471 443 423 420 Z" fill="{WHITE}"/>
<path d="M266 382 Q314 379 363 385 M426 386 Q472 378 516 383" fill="none" stroke="{BLACK}" stroke-width="8"/>
<circle cx="328" cy="414" r="12" fill="{BLACK}"/><circle cx="477" cy="412" r="12" fill="{BLACK}"/>
<path d="M385 478 l25 0 M397 473 l0 10" fill="none" {SW}/>""",
}
# Swappable left arm/hand is located in front of the head lower muzzle.
HANDS={
"think":f"""<path d="M307 643 Q266 625 271 584 Q268 551 296 540
Q322 531 328 549 Q345 550 346 568 Q361 578 343 595
L320 638 Z" fill="{WHITE}" {INK}/>
<path d="M297 545 Q301 566 312 574 M322 548 Q316 563 327 576" fill="none" {SW}/>""",
"fist":f"""<path d="M289 644 Q272 619 264 593 Q247 573 263 554
Q275 538 294 543 Q303 529 319 537
Q336 541 333 560 Q350 573 335 591
L322 635 Z" fill="{WHITE}" {INK}/>""",
"point":f"""<path d="M290 643 Q251 610 245 584 L133 569
Q112 561 121 539 Q128 526 149 528 L266 537
Q290 531 302 551 L321 631 Z" fill="{WHITE}" {INK}/>
<path d="M150 545 L242 553" fill="none" {SW}/>""",
}
# Pose offset / head parenting uses shared anchor coordinates.
PIVOTS={
"tail":[528,668],"body":[388,635],"foot_left":[310,852],
"foot_right":[469,855],"arm_left_base":[297,608],
"arm_right_base":[489,610],"head":[398,545],
"glasses":[397,380],"expression":[398,386],"hand":[304,626],
}
ORDER=["tail","body","foot_left","foot_right","arm_left_base",
       "arm_right_base","head","expression","glasses","hand"]
def make_svg(fragment):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
            f'viewBox="0 0 {W} {H}">{fragment}</svg>')
def render(fragment):
    data=cairosvg.svg2png(bytestring=make_svg(fragment).encode(),output_width=W,output_height=H)
    return Image.open(io.BytesIO(data)).convert("RGBA")
def write_asset(im, name, root, metadata):
    dest=root/"parts"/(name+".png")
    im.save(dest)
    bbox=im.getchannel("A").getbbox()
    if not bbox:
        raise RuntimeError("Empty rig sprite: "+name)
    trimmed=im.crop(bbox)
    trimmed.save(root/"trimmed"/(name+".png"))
    pivot_key=("expression" if name.startswith("eyes_") else
               "hand" if name.startswith("hand_") else name)
    metadata[name]={"file":str(dest.relative_to(root)),
                    "trimmed":f"trimmed/{name}.png",
                    "bbox":list(bbox),"pivot":PIVOTS.get(pivot_key,[400,480]),
                    "size":[W,H]}
    return im
def compose(layers):
    base=Image.new("RGBA",(W,H))
    for layer in layers: base.alpha_composite(layer)
    return base
def build(out):
    out=Path(out); (out/"parts").mkdir(parents=True,exist_ok=True)
    (out/"trimmed").mkdir(exist_ok=True)
    (out/"poses").mkdir(exist_ok=True)
    (out/"previews").mkdir(exist_ok=True)
    metadata={}
    base={}
    for name,frag in ART.items():
        base[name]=write_asset(render(frag),name,out,metadata)
    for k,frag in EYES.items():
        base["eyes_"+k]=write_asset(render(frag),"eyes_"+k,out,metadata)
    for k,frag in HANDS.items():
        base["hand_"+k]=write_asset(render(frag),"hand_"+k,out,metadata)
    combos=[]
    for pose in HANDS:
        for mood in EYES:
            order=[base["tail"],base["body"],base["foot_left"],base["foot_right"],
                   base["arm_left_base"],base["arm_right_base"],
                   base["head"],base["eyes_"+mood],base["glasses"],base["hand_"+pose]]
            composite=compose(order)
            name=f"{pose}_{mood}"
            composite.save(out/"poses"/(name+".png"))
            combos.append((name,composite))
    # Contact sheet, on solid yellow test background
    tile=(330,396); canvas=Image.new("RGB",(tile[0]*3,tile[1]*3),(249,232,162))
    draw=ImageDraw.Draw(canvas)
    for i,(name,im) in enumerate(combos):
        thumb=im.copy();thumb.thumbnail((tile[0]-8,tile[1]-30))
        x=(i%3)*tile[0]; y=(i//3)*tile[1]
        canvas.paste(thumb,(x+(tile[0]-thumb.width)//2,y),thumb)
        draw.text((x+15,y+tile[1]-22),name,fill=(22,25,29))
    canvas.save(out/"previews"/"contact_sheet.png")
    data={"name":"Yodan Gakkai Blue Cat","coordinate_system":{"width":W,"height":H,"y_down":True},
          "style":{"blue":BLUE,"stripe_blue":DARKBLUE,"white":WHITE,"outline":BLACK},
          "layer_order":ORDER,"assets":metadata,
          "expressions":list(EYES),"hand_poses":list(HANDS),
          "notes":"Vector recreation from visual reference; NOT extracted original pixels. "
                  "All layers are aligned to common 800x960 canvas. "
                  "Trimmed crops include original bbox for recomposition."}
    (out/"rig_manifest.json").write_text(json.dumps(data,indent=2,ensure_ascii=False))
    print(f"Generated {len(metadata)} transparent layered PNGs + {len(combos)} poses",flush=True)

if __name__=="__main__":
    import argparse
    p=argparse.ArgumentParser()
    p.add_argument("--out",default="out/yodan-cat")
    args=p.parse_args()
    build(args.out)
