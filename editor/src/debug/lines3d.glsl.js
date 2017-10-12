export default "@export ecgl.lines3D.clipNear\n\nvec4 clipNear(vec4 p1, vec4 p2) {\n float n = (p1.w - near) / (p1.w - p2.w);\n return vec4(mix(p1.xy, p2.xy, n), -near, near);\n}\n\n@end\n\n@export ecgl.lines3D.expandLine\n vec4 prevProj = worldViewProjection * vec4(positionPrev, 1.0);\n vec4 currProj = worldViewProjection * vec4(position, 1.0);\n vec4 nextProj = worldViewProjection * vec4(positionNext, 1.0);\n\n if (currProj.w < 0.0) {\n if (nextProj.w > 0.0) {\n currProj = clipNear(currProj, nextProj);\n }\n else if (prevProj.w > 0.0) {\n currProj = clipNear(currProj, prevProj);\n }\n }\n\n vec2 prevScreen = (prevProj.xy / abs(prevProj.w) + 1.0) * 0.5 * viewport.zw;\n vec2 currScreen = (currProj.xy / abs(currProj.w) + 1.0) * 0.5 * viewport.zw;\n vec2 nextScreen = (nextProj.xy / abs(nextProj.w) + 1.0) * 0.5 * viewport.zw;\n\n vec2 dir;\n float len = offset;\n if (position == positionPrev) {\n dir = normalize(nextScreen - currScreen);\n }\n else if (position == positionNext) {\n dir = normalize(currScreen - prevScreen);\n }\n else {\n vec2 dirA = normalize(currScreen - prevScreen);\n vec2 dirB = normalize(nextScreen - currScreen);\n\n vec2 tanget = normalize(dirA + dirB);\n\n float miter = 1.0 / max(dot(tanget, dirA), 0.5);\n len *= miter;\n dir = tanget;\n }\n\n dir = vec2(-dir.y, dir.x) * len;\n currScreen += dir;\n\n currProj.xy = (currScreen / viewport.zw - 0.5) * 2.0 * abs(currProj.w);\n@end\n\n\n@export ecgl.meshLines3D.vertex\n\nattribute vec3 position: POSITION;\nattribute vec3 positionPrev;\nattribute vec3 positionNext;\nattribute float offset;\nattribute vec4 a_Color : COLOR;\n\n#ifdef VERTEX_ANIMATION\nattribute vec3 prevPosition;\nattribute vec3 prevPositionPrev;\nattribute vec3 prevPositionNext;\nuniform float percent : 1.0;\n#endif\n\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\nuniform vec4 viewport : VIEWPORT;\nuniform float near : NEAR;\n\nvarying vec4 v_Color;\n\n@import ecgl.lines3D.clipNear\n\nvoid main()\n{\n @import ecgl.lines3D.expandLine\n\n gl_Position = currProj;\n\n v_Color = a_Color;\n}\n@end\n\n\n@export ecgl.meshLines3D.fragment\n\nuniform vec4 color : [1.0, 1.0, 1.0, 1.0];\n\nvarying vec4 v_Color;\n\n@import qtek.util.srgb\n\nvoid main()\n{\n#ifdef SRGB_DECODE\n gl_FragColor = sRGBToLinear(color * v_Color);\n#else\n gl_FragColor = color * v_Color;\n#endif\n}\n\n@end";
