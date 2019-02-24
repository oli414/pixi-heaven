namespace pixi_heaven {
	import MultiTextureSpriteRenderer = pixi_heaven.webgl.MultiTextureSpriteRenderer;

	class SpriteHeavenRenderer extends MultiTextureSpriteRenderer {
		shaderVert =
			`precision highp float;
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute float aHue;
attribute float aTextureId;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;
varying float vHue;
varying float vTextureId;

void main(void){
    gl_Position.xyw = projectionMatrix * vec3(aVertexPosition, 1.0);
    gl_Position.z = 0.0;
    
    vTextureCoord = aTextureCoord;
    vTextureId = aTextureId;
    vHue = aHue;
}
`;
		shaderFrag = `
varying vec2 vTextureCoord;
varying float vHue;
varying float vTextureId;
uniform sampler2D uSamplers[%count%];

vec3 hueShift( vec3 color, float hueAdjust ){

	const vec3  kRGBToYPrime = vec3 (0.299, 0.587, 0.114);
	const vec3  kRGBToI      = vec3 (0.596, -0.275, -0.321);
	const vec3  kRGBToQ      = vec3 (0.212, -0.523, 0.311);

	const vec3  kYIQToR     = vec3 (1.0, 0.956, 0.621);
	const vec3  kYIQToG     = vec3 (1.0, -0.272, -0.647);
	const vec3  kYIQToB     = vec3 (1.0, -1.107, 1.704);

	float   YPrime  = dot (color, kRGBToYPrime);
	float   I       = dot (color, kRGBToI);
	float   Q       = dot (color, kRGBToQ);
	float   hue     = atan (Q, I);
	float   chroma  = sqrt (I * I + Q * Q);

	hue += hueAdjust;

	Q = chroma * sin (hue);
	I = chroma * cos (hue);

	vec3    yIQ   = vec3 (YPrime, I, Q);

	return vec3( dot (yIQ, kYIQToR), dot (yIQ, kYIQToG), dot (yIQ, kYIQToB) );

}

void main(void) {
vec4 texColor;
vec2 texCoord = vTextureCoord;
float textureId = floor(vTextureId+0.5);
%forloop%
gl_FragColor = vec4(hueShift(texColor.rgb, vHue), texColor.a);
}`;

		createVao(vertexBuffer: PIXI.glCore.GLBuffer) {
			const attrs = this.shader.attributes;
			this.vertSize = attrs.aTextureId ? 5 : 4;
			this.vertByteSize = this.vertSize * 4;


			const gl = this.renderer.gl;
			const vao = this.renderer.createVao()
				.addIndex(this.indexBuffer)
				.addAttribute(vertexBuffer, attrs.aVertexPosition, gl.FLOAT, false, this.vertByteSize, 0)
				.addAttribute(vertexBuffer, attrs.aTextureCoord, gl.UNSIGNED_SHORT, true, this.vertByteSize, 2 * 4)
				.addAttribute(vertexBuffer, attrs.aHue, gl.FLOAT, false, this.vertByteSize, 3 * 4);

			if (attrs.aTextureId) {
				vao.addAttribute(vertexBuffer, attrs.aTextureId, gl.FLOAT, false, this.vertByteSize, 4 * 4);
			}

			return vao;
		}

		fillVertices(float32View: Float32Array, uint32View: Uint32Array, index: number, sprite: any, textureId: number) {
			//first, fill the coordinates!

			const vertexData = sprite.vertexData;

			const n = vertexData.length;

			const hue = sprite.color.hue;
			const stride = this.vertSize;
			const oldIndex = index;

			for (let i = 0; i < n; i += 2) {
				float32View[index] = vertexData[i];
				float32View[index + 1] = vertexData[i + 1];
				float32View[index + 3] = hue;
				index += stride;
			}

			const uvs = sprite.uvs;
			if (uvs) {
				index = oldIndex + 2;
				for (let i = 0; i < n; i += 2) {
					uint32View[index] = (((uvs[i + 1] * 65535) & 0xFFFF) << 16) | ((uvs[i] * 65535) & 0xFFFF);
					index += stride;
				}
			} else {
				const _uvs = sprite._texture._uvs.uvsUint32;
				index = oldIndex + 2;
				for (let i = 0; i < n; i += 2) {
					uint32View[index] = _uvs[i >> 1];
					index += stride;
				}
			}

			if (stride === 5) {
				index = oldIndex + 4;
				for (let i = 0; i < n; i += 2) {
					float32View[index] = textureId;
					index += stride;
				}
			}
		}
	}

	PIXI.WebGLRenderer.registerPlugin('spriteHeaven', SpriteHeavenRenderer);
}