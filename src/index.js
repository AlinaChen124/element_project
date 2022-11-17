import Button from "./components/Button/index.js";
import Icon from "./components/Icon/index.js"
import Select from "./components/Select/index.js";
import MyRow from "./components/MyRow/index.js"
import MyCol from "./components/MyCol/index.js"
import {MyAside,MyContainer,MyFooter,MyHeader,MyMain} from "./components/Container/index.js"
import MyInput from "./components/MyInput/index.js";
import { MyMenu,MenuItem } from "./components/Menu/index.js";
import ToolTip from "./components/Tooltip/index.js";
import PopoverItem from "./components/Popover/index.js";
import CheckBox from "./components/Checkbox/index.js";
import Tag from "./components/Tag/index.js";
import Alert from "./components/Alert/index.js";
import { loading, vLoading } from './components/Loading/index'
import Badge from "./components/Badge/index.js";
import Divider from "./components/Divider/index.js";
// import Table from "./components/Table/index.js";
// import TableVue from "./components/TableVue/index.js";
import Table from "./components/TableNew/index.js";
const install = (app)=>{
  app.use(Button)
}
const UI = {
  install
}
// 支持按需导入
export {
  Button,
  Icon,
  Select,
  MyRow,
  MyCol,
  MyAside,
  MyContainer,
  MyFooter,
  MyHeader,
  MyMain,
  MyInput,
  MyMenu,
  MenuItem,
  ToolTip,
  PopoverItem,
  CheckBox,
  Tag,
  Alert,
  loading, 
  vLoading,
  Badge,
  Divider,
  Table,
}
// 支持全局导入
export default UI 