import presetWind3 from '@unocss/preset-wind3';
import transformerCompileClass from '@unocss/transformer-compile-class';
import { defineConfig } from 'unocss';

export default defineConfig({
  presets: [presetWind3()],
  transformers: [
    transformerCompileClass({
      classPrefix: 'rfu_'
    })
  ]
});
