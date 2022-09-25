# time-data-Vis
    本项目以网络数据为起点，构建了一个在线数据流形式的动态网络时序特征的可视化系统，在保留动态图心理基础后，通过HAC边限制度排序聚类算法提取了视图的主干特征，并通过LDA降维社区伪节点创造面积碰撞河流图生成
社区节点的降维显示。

    time-data-Vis效果图
![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/1.PNG)

    主图设计
![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/2.PNG)

    HACLinkD聚类图

![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/3.PNG)
    

    LDASocialSorted图

    多个的社区LDA分布
![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/7.PNG)
    单个社区的LDA分布
![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/8.PNG)


# 主视图算法
    节点使用度排序标签传播分类
![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/main/1.PNG)

    附加边新增算法
![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/main/2.PNG)

    节点新增算法
![Image text](https://github.com/ZhangLangZhong/time_data_vis/blob/master/src/assets/image/main/3.PNG)

