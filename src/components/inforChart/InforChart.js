import React, { useEffect, useLayoutEffect, useState } from 'react'
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Radio, Tabs, Menu,Input,Checkbox   } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

import useSyncCallback from '../../MyHooks/useSyncCallback';
import { sendAction } from '../../redux/action';
import store from '../../redux/store';
import { Provider } from 'react-redux';
import { Connect } from 'react-redux';
import './InforChart.css'
import PubSub from 'pubsub-js'
import NodeAge from './NodeAge';
import NodeSocial from './NodeSocial';
import NodeDegree from './NodeDegree';
import NodeAdress from './NodeAdress';
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
  const [tempnode,settempnode] = useState([])



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
    PubSub.subscribe('nowNode',(msg,data)=>{
      setnodeid(data.id)
      setnodeAge(data.age)
      setdegreeCenter('2.26e-03')
      setnearCenter('2.26e-03')
      // setnodeSocial(data.subs)
      setnodeSizeControl(5 + 0.4*(data.age-1))
      setnodeAgeControl(data.age)
      setnodeOpacityControl(1)
      setedgeWidthControl(2)
      setedgeOpacControl(1)
    })
    PubSub.subscribe('hacNodes',(msg,data)=>{
      settempnode(data)
    })
    for(let item of tempnode){
        if(item.id == nodeid ){
            setnodeSocial(Math.abs(item.index))
        }
    }

 
  },[nodeid])

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
    getItem('????????????', 'sub1', <SettingOutlined  />, [
      getItem('??????', 'sub2', null, [
        getItem(<Input addonBefore='????????????' defaultValue={nodeSizeControl} value={nodeSizeControl} />),
        getItem(<Input addonBefore='???????????????' defaultValue={nodeOpacityControl} value={nodeOpacityControl} />),
        getItem(<Input addonBefore='????????????' defaultValue={nodeAgeControl} value={nodeAgeControl} />),
        getItem(<Checkbox onChange={onChange}>????????????</Checkbox>),

      ]),
      getItem('???', 'sub3', null, [ 
        getItem(<Input addonBefore='?????????' defaultValue={edgeWidthControl} value={edgeWidthControl} />),
        getItem(<Input addonBefore='????????????' defaultValue={edgeOpacControl} value={edgeOpacControl} />)
      ]),
    ]),

    getItem('????????????', 'sub4', <AppstoreOutlined />, [
      getItem(<Input addonBefore='????????????' defaultValue={nodesNum} value={nodesNum} />),
      getItem(<Input addonBefore='?????????' defaultValue={edgesNum} value={edgesNum} />),
      getItem(<Input addonBefore='??????ID' defaultValue={nodeid} value={nodeid} />),
      getItem(<Input addonBefore='????????????' defaultValue={nodeSocial} value={nodeSocial}/>),
      getItem(<Input addonBefore='????????????' defaultValue={nodeAge} value={nodeAge} />),
      getItem(<Input addonBefore='????????????' defaultValue={degreeCenter} value={degreeCenter} />),
      getItem(<Input addonBefore='???????????????' defaultValue={nearCenter} value={nearCenter} />),
      getItem(<Input addonBefore='?????????????????????' defaultValue={nodespecial} value={nodespecial} />),
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
        {ischecked == true?<NodeAdress/>:null}

 

    </div >
    
  )
}


