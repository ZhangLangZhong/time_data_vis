import React, { useEffect, useLayoutEffect, useState } from 'react'
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Radio, Tabs, Menu,Input,Checkbox   } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

import { sendAction } from '../../redux/action';
import store from '../../redux/store';
import { Provider } from 'react-redux';
import { Connect } from 'react-redux';
import './InforChart.css'
import PubSub from 'pubsub-js'
import NodeAge from './NodeAge';
import NodeSocial from './NodeSocial';
import NodeDegree from './NodeDegree';
export default function InforChart() {

  const [nodesNum,setnodesNum] = useState(115)
  const [edgesNum,setedgesNum] = useState(202)

  const [nodeid,setnodeid] = useState(0)
  const [nodeSocial,setnodeSocial] = useState(0)
  const [nodeAge,setnodeAge] = useState(0)
  const [degreeCenter,setdegreeCenter] = useState(0)
  const [nearCenter,setnearCenter] = useState(0)
  const [nodespecial,setnodespecial] = useState(0)


  const [nodeSizeControl,setnodeSizeControl] = useState(0)
  const [nodeOpacityControl,setnodeOpacityControl] = useState(0)
  const [nodeAgeControl,setnodeAgeControl] = useState(0)
  const [edgeWidthControl,setedgeWidthControl] = useState(0)
  const [edgeOpacControl,setedgeOpacControl] = useState(0)

  const [ischecked,setischecked] = useState(false)




  useEffect(()=>{
    // store.subscribe(()=>{
    //   console.log('nodes_total',store.getstate)
    //   setnodesNum(nodesNum => store.getState('nodes_total'))
    //   setedgesNum(edgesNum => store.getState())
    // })
    PubSub.publishSync('ischecked',ischecked)

    PubSub.subscribe('nodesNum',(msg,data)=>{
      setnodesNum(data.length)
    })
    PubSub.subscribe('edgesNum',(msg,data)=>{
      setedgesNum(data.length)
    })
 
  },[])

  

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const onChange = (e) => {
    // console.log(`checked = ${e.target.checked}`);
    setischecked(!ischecked)
  };

  const items = [
    getItem('布局控制', 'sub1', <SettingOutlined  />, [
      getItem('节点', 'sub2', null, [
        getItem(<Input addonBefore='节点尺寸' defaultValue={nodeSizeControl} value={nodeSizeControl} />),
        getItem(<Input addonBefore='节点透明度' defaultValue={nodeOpacityControl} value={nodeOpacityControl} />),
        getItem(<Input addonBefore='节点能级' defaultValue={nodeAgeControl} value={nodeAgeControl} />),
        getItem(<Checkbox onChange={onChange}>标记节点</Checkbox>),

      ]),
      getItem('边', 'sub3', null, [ 
        getItem(<Input addonBefore='边宽度' defaultValue={edgeWidthControl} value={edgeWidthControl} />),
        getItem(<Input addonBefore='边透明度' defaultValue={edgeOpacControl} value={edgeOpacControl} />)
      ]),
    ]),

    getItem('布局属性', 'sub4', <AppstoreOutlined />, [
      getItem(<Input addonBefore='节点总量' defaultValue={nodesNum} value={nodesNum} />),
      getItem(<Input addonBefore='边总量' defaultValue={edgesNum} value={edgesNum} />),
      getItem(<Input addonBefore='节点ID' defaultValue={nodeid} value={nodeid} />),
      getItem(<Input addonBefore='节点社区' defaultValue={nodeSocial} value={nodeSocial}/>),
      getItem(<Input addonBefore='节点能级' defaultValue={nodeAge} value={nodeAge} />),
      getItem(<Input addonBefore='度中心性' defaultValue={degreeCenter} value={degreeCenter} />),
      getItem(<Input addonBefore='接近中心性' defaultValue={nearCenter} value={nearCenter} />),
      getItem(<Input addonBefore='特征向量中心性' defaultValue={nodespecial} value={nodespecial} />),
    ]),
  ];

  // const onClick = (e) => {
  //   console.log('click ', e);
  // };
  // let widthNow = document.getElementsByClassName('inforchart')
  // console.log(widthNow[0].clientWidth)

  return (
    <div className='inforchart'>
      <Menu
        // onClick={onClick}
        style={{
          width: document.getElementsByClassName('inforchart').width,
        }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1','sub2','sub3','sub4']}
        mode="inline"
        items={items}
      />

        {ischecked == true?<NodeAge/>:null}
        {ischecked == true?<NodeSocial/>:null}
        {ischecked == true?<NodeDegree/>:null}

 

    </div >
    
  )
}


