import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'
export const config: Config = {
  namespace: 'mep-components',
  srcDir: 'src',
  buildEs5: true,
  extras: {
    cssVarsShim: true,
    dynamicImportShim: true,
    shadowDomShim: true,
    safari10: true,
    scriptDataOpts: true,
    appendChildSlotFix: false,
    cloneNodeFix: false,
    slotChildNodesFix: true,
  },
  outputTargets: [
    {
      type: 'dist'
    },
    {
      type: 'www'
    }
  ],
  devServer: {
    reloadStrategy: 'pageReload',
    port: 4444
  },
  plugins: [sass()]
}