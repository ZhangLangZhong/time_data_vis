# time-data-Vis


本项目以网络数据为起点，构建了一个在线数据流形式的动态网络时序特征的可视化系统， 
在保留动态图心理基础后，通过HAC边限制度排序聚类算法提取了视图的主干特征，并通过LDA
降维社区伪节点创造面积碰撞河流图生成社区节点的降维显示。

<h1>项目环境</h1>

<li>python 3.8</li>
<li>d3.v3.js</li>
<li>echarts 5.3.3</li>
<li>react 18.2</li>
<li>redux-router 5.3</li>
<li>redux 4.2.0</li>

<h1>项目启动:</h1>
<li>python3 time_VIS.py</li>
<li>npm start</li>

<h1>浏览器中打开</h1>
<li>http://localhost:3000/</li>


<h1>项目效果图<h1>

<h2>效果图</h2>

![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/1.PNG)

<h2>主图设计</h2>

![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/2.PNG)

<h2>HACLinkD聚类图</h2>

![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/3.PNG)
    

<h2>LDASocialSorted图</h2>

<h3>多个的社区LDA分布</h3>

![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/7.PNG)

<h3>单个社区的LDA分布</h3>

![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/8.PNG)


# 主视图算法
    节点使用度排序标签传播分类
![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/main/1.PNG)

    附加边新增算法
![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/main/2.PNG)

    节点新增算法
![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/main/3.PNG)

