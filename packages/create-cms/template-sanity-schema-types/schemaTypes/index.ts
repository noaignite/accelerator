import * as blocks from './blocks'
import * as documents from './documents'
import * as objects from './objects'

export default [...Object.values(documents), ...Object.values(blocks), ...Object.values(objects)]
