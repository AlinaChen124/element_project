// ifHex - 判断是否时hex格式

 export const ifHex = (val) => {
  return (typeof(val) === 'string' && /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(val)) ? true : false;
}

// 返回元素偏移位置
export const getOffset = (el)=>{
  //用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置
  // 该函数返回一个Object对象，该对象有6个属性：top,lef,right,bottom,width,height 
  const componentRect = el.getBoundingClientRect()
  // document.documentElement返回文档对象的根元素<html>
  // window.pageYOffset返回页面相对于浏览器左上角的位置上(scrollY)
  // document.documentElement.clientTop返回html边框高度
  const top = componentRect.top + (window.pageYOffset || document.documentElement.scrollTop)-(document.documentElement.clientTop||0)
  const left = componentRect.left + (window.pageXOffset || document.documentElement.scrollLeft)-(document.documentElement.clientLeft||0)
  let width = el.offsetWidth
  let height = el.offsetHeight
  return {left:left,top:top,width:width,height:height}
}

export const getWindow = ()=>{
  const width = document.documentElement.clientWidth||document.body.clientWidth
  const height = document.documentElement.clientHeight||document.body.clientHeight
  return {width:width,height:height}
}