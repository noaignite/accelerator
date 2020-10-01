import enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import createDOM from './createDOM'

createDOM()

enzyme.configure({ adapter: new Adapter() })
