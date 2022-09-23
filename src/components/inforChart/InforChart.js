import React, { useEffect, useLayoutEffect, useState } from 'react'
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Radio, Tabs, Menu,Input } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

import { sendAction } from '../../redux/action';
import store from '../../redux/store';
import ComponentA from './componentA';
import ComponentB from './componentB';
import { Provider } from 'react-redux'
import { Connect } from 'react-redux';
import './InforChart.css'

export default function InforChart() {

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const items = [
    getItem('布局控制', 'sub1', <SettingOutlined  />, [
      getItem('节点', 'sub2', null, [
        getItem('节点尺寸', '7'),
        getItem('节点透明度', '8')
      ]),
      getItem('边', 'sub3', null, [
        getItem('边宽度', '9'),
        getItem('边编号', '10')
      ]),
    ]),

    getItem('布局属性', 'sub4', <AppstoreOutlined />, [
      getItem(<Input addonBefore='节点总量' defaultValue="mysite" />),
      getItem(<Input addonBefore='边总量' defaultValue="mysite" />),
      getItem('节点ID', '88'),
      getItem('节点度', '123'),
      // getItem('Submenu', 'sub5', null, [
      //   getItem('Option 11', '11'),
      //   getItem('Option 12', '12')
      // ]),
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
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
      />

    </div >

  )
}
