"""Build a Blender .blend 2D cutout puppet from generated PNGs.

Usage: blender -b -t 2 --python shared/mascots/yodan-cat/build_blend.py -- \
  out/yodan-cat out/yodan-cat/yodan_cat_rig.blend
"""
import bpy, json, sys
from pathlib import Path

def argv():
    a=sys.argv
    return a[a.index("--")+1:] if "--" in a else []

args=argv()
if len(args)!=2: raise ValueError("Require input asset folder and output .blend file")
root=Path(args[0]).resolve(); output=Path(args[1]).resolve()
info=json.loads((root/"rig_manifest.json").read_text())
W=info["coordinate_system"]["width"];H=info["coordinate_system"]["height"]
scale=.01
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
collection=bpy.data.collections.new("YODAN_CAT_2D_RIG")
bpy.context.scene.collection.children.link(collection)
rig=bpy.data.objects.new("CAT_MASTER_MOVE_ROTATE",None)
collection.objects.link(rig)
rig.empty_display_type='CIRCLE';rig.empty_display_size=.7

def xy(pt):return ((pt[0]-W/2)*scale,(H/2-pt[1])*scale)
def sprite(name,z):
    a=info["assets"][name]
    xmin,ymin,xmax,ymax=a["bbox"]
    pivot=a["pivot"]
    x1=(xmin-pivot[0])*scale;x2=(xmax-pivot[0])*scale
    y1=(pivot[1]-ymax)*scale;y2=(pivot[1]-ymin)*scale
    vertices=[(x1,y1,0),(x2,y1,0),(x2,y2,0),(x1,y2,0)]
    mesh=bpy.data.meshes.new(name+"_quad")
    mesh.from_pydata(vertices,[],[(0,1,2,3)])
    mesh.update()
    uv=mesh.uv_layers.new()
    # Image is top-down, Blender's UV is bottom-up.
    for loop in mesh.loops:
        v=mesh.vertices[loop.vertex_index].co
        u=0 if abs(v.x-x1)<1e-4 else 1
        vuv=0 if abs(v.y-y1)<1e-4 else 1
        uv.data[loop.index].uv=(u,vuv)
    obj=bpy.data.objects.new(name,mesh);collection.objects.link(obj)
    x,y=xy(pivot);obj.location=(x,y,z)
    file=str(root/a["trimmed"])
    img=bpy.data.images.load(file,check_existing=True)
    img.filepath="//"+a["trimmed"]
    mat=bpy.data.materials.new(name+"_alpha")
    mat.use_nodes=True
    nd=mat.node_tree.nodes;nd.clear()
    tex=nd.new("ShaderNodeTexImage");tex.image=img;tex.interpolation="Linear"
    emiss=nd.new("ShaderNodeEmission")
    clear=nd.new("ShaderNodeBsdfTransparent")
    mix=nd.new("ShaderNodeMixShader")
    out=nd.new("ShaderNodeOutputMaterial")
    ln=mat.node_tree.links
    ln.new(tex.outputs["Color"],emiss.inputs["Color"])
    ln.new(tex.outputs["Alpha"],mix.inputs[0])
    ln.new(clear.outputs[0],mix.inputs[1])
    ln.new(emiss.outputs[0],mix.inputs[2]);ln.new(mix.outputs[0],out.inputs[0])
    mat.diffuse_color=(1,1,1,1)
    if hasattr(mat,"blend_method"):mat.blend_method='BLEND'
    mesh.materials.append(mat)
    obj.parent=rig
    obj["pivot_px"]=list(pivot)
    obj["layer_index"]=z
    return obj

ordered=info["layer_order"]
all_objs={}
for idx,name in enumerate(ordered):
    if name=="expression":
        for k in info["expressions"]:
            key="eyes_"+k
            all_objs[key]=sprite(key,idx*.015)
    elif name=="hand":
        for k in info["hand_poses"]:
            key="hand_"+k
            all_objs[key]=sprite(key,idx*.015)
    else:all_objs[name]=sprite(name,idx*.015)
for name,obj in all_objs.items():
    vis=not ((name.startswith("eyes_") and name!="eyes_jito")
              or (name.startswith("hand_") and name!="hand_think"))
    obj.hide_render=not vis
    obj.hide_set(not vis)

# Controller empties: group transforms for easier animation and masking.
def controller(name,point,master):
    ob=bpy.data.objects.new(name,None)
    collection.objects.link(ob)
    ob.empty_display_size=.22;ob.empty_display_type="SPHERE"
    x,y=xy(point);ob.location=(x,y,0)
    ob.parent=master
    return ob
headctrl=controller("CTRL_HEAD_TILT",info["assets"]["head"]["pivot"],rig)
tailctrl=controller("CTRL_TAIL_SWING",info["assets"]["tail"]["pivot"],rig)
handctrl=controller("CTRL_LEFT_HAND_GESTURE",info["assets"]["hand_think"]["pivot"],rig)
def parent_preserving_world(obj,ctrl):
    matrix=obj.matrix_world.copy()
    obj.parent=ctrl
    obj.matrix_world=matrix
for name in ["head","glasses"]+[f"eyes_{x}" for x in info["expressions"]]:
    parent_preserving_world(all_objs[name],headctrl)
parent_preserving_world(all_objs["tail"],tailctrl)
for x in info["hand_poses"]: parent_preserving_world(all_objs["hand_"+x],handctrl)

bpy.context.scene.render.resolution_x=W
bpy.context.scene.render.resolution_y=H
bpy.context.scene.render.resolution_percentage=100
bpy.context.scene.render.film_transparent=True
bpy.context.scene.render.image_settings.file_format="PNG"
bpy.context.scene.render.image_settings.color_mode="RGBA"
cam_data=bpy.data.cameras.new("Ortho_Camera")
cam=bpy.data.objects.new("Ortho_Camera",cam_data)
collection.objects.link(cam)
cam.location=(0,0,24);cam.rotation_euler=(0,0,0)
cam_data.type="ORTHO";cam_data.ortho_scale=H*scale
bpy.context.scene.camera=cam
bpy.context.scene["expression_variants"]="eyes_jito / eyes_niyari / eyes_akire"
bpy.context.scene["gesture_variants"]="hand_think / hand_fist / hand_point"
bpy.context.scene["usage"]="Toggle eye/hand object visibility (viewport + render); animate CTRL empties"
bpy.ops.wm.save_as_mainfile(filepath=str(output))
print("Saved 2D cutout Blender rig:",output)
