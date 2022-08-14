from flask import Flask,request
import json
import os
from typing import Any,List
import matplotlib.pyplot as plt
from flask import render_template, jsonify
import re
import time
import pandas as pd
from glom import glom

g_b = 0

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')
    # return "Hello World1111!"

@app.route('/api/initial')
def get_initial_data():
    try:  
        with open('files/jsonFormat/time-line.json') as fi:
            result = json.load(fi)
            return jsonify(result)
    except:
        return jsonify({})

@app.route('/api/brush_extent')
def get_brush_extent_data():
    flag = False
    result = {'nodes': [], 'links': []}
    start_time = request.args.get('start')
    # print(start_time)
    end_time = request.args.get('end')
    path = 'files/jsonFormat/packages/'
    files = os.listdir(path)
    global g_b
    global souTar
    date = re.match(r"(\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}_\d{1,2})", files[g_b])
    if date:
        time = files[g_b].replace('.json', '')
        time = time.replace('_', ':')
        if time == start_time:
            flag = not flag
        if time == end_time:
            flag = not flag
        if flag:
            json_data = pd.read_json(path + files[g_b])
            dataSource = json_data['links'].apply(lambda row:glom(row,'source'))
            dataTarget = json_data['links'].apply(lambda row:glom(row,'target'))
            for i in range(0,len(dataSource)):
                value = {"source":dataSource[i],"target":dataTarget[i]}
                result['links'].append(value)
            souTar = result['links']
    g_b = g_b + 1
    # print(result)
    return jsonify(result)

@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/api/element_position')
def HAC_CLUSTRING():
    mergeRatio = 0.002
    clusterCenterNumber = 28
    layoutNodesInformation = request.args.get("nodeInformation")
    jsonNodeData = pd.read_json(layoutNodesInformation,orient="records")
    allNodes = {"nodes":[],"links":[]}
    node_id = jsonNodeData["id"]
    node_x = jsonNodeData["x"]
    node_y = jsonNodeData["y"]
    node_degree = jsonNodeData["degree"]
    node_links = jsonNodeData['links']
    numberTemp = 0
    for i in range(0,len(jsonNodeData)):
        value = {"id":node_id[i],"x":node_x[i],"y":node_y[i],"group":node_id[i],"index":numberTemp,"degree":node_degree[i],"status":-1,'links':node_links[i]}
        numberTemp = numberTemp + 1
        allNodes["nodes"].append(value)
    pointsNumber = len(node_id)
    tarSouNumber = len(souTar)
    distanceMap = {}
    node_hash = HashTable()
    hashTemp = node_hash
    for i in allNodes["nodes"]:
        node_hash.put(i["id"],i)
        hashTemp = node_hash      
    distanceMap = {}
    for i in souTar:
        linkSource = int(i["source"])
        linkTarget = int(i["target"])
        if hashTemp.get(int(i["target"]))["degree"] > hashTemp.get(int(i["source"]))["degree"]:
            temp = linkSource
            linkSource = linkTarget
            linkTarget = temp
        souX = hashTemp.get(linkSource)["x"]
        souY = hashTemp.get(linkSource)["y"]
        tarX = hashTemp.get(linkTarget)["x"]
        tarY = hashTemp.get(linkTarget)["y"]
        nodesDistance = (souX - tarX) * (souX - tarX) + (souY - tarY) * (souY - tarY)
        distanceMap[str(hashTemp.get(linkSource)["id"]) + '#' + str(hashTemp.get(linkTarget)["id"])] = nodesDistance/(hashTemp.get(linkTarget)['degree']*0.5)

    distanceMap = sorted(distanceMap.items(), key=lambda dist: dist[1], reverse=False)
    print(distanceMap)
    unsortedGroup = {index:1 for index in range(len(allNodes["nodes"]))}
    for key,_ in distanceMap:
        lowIndex, highIndex = int(key.split("#")[0]), int(key.split("#")[1])
        if hashTemp.get(lowIndex)["index"] != hashTemp.get(highIndex)["index"]:
            lowGroupIndex = hashTemp.get(lowIndex)["index"]
            highGroupIndex = hashTemp.get(highIndex)["index"]
            if (unsortedGroup.get(lowGroupIndex) != None and unsortedGroup.get(highGroupIndex) != None):
                if(unsortedGroup[lowGroupIndex] <= 1 and unsortedGroup[highGroupIndex] <= 1):
                    unsortedGroup[lowGroupIndex] = unsortedGroup[highGroupIndex] + unsortedGroup[lowGroupIndex]
                    hashTemp.get(highIndex)['index'] = abs(lowGroupIndex)
                    hashTemp.get(highIndex)['status'] = abs(hashTemp.get(highIndex)['status'])
                    hashTemp.get(lowIndex)['status'] = abs(hashTemp.get(lowIndex)['status'])
                    del unsortedGroup[highGroupIndex]
                    continue
                if (unsortedGroup[lowGroupIndex] > 1 and unsortedGroup[highGroupIndex] <= 1):
                    unsortedGroup[lowGroupIndex] = unsortedGroup[highGroupIndex] + unsortedGroup[lowGroupIndex]
                    hashTemp.get(highIndex)['index'] = abs(lowGroupIndex)
                    hashTemp.get(highIndex)['status'] = abs(hashTemp.get(highIndex)['status'])
                    del unsortedGroup[highGroupIndex]
                    continue
                if (unsortedGroup[lowGroupIndex] <= 1 and unsortedGroup[highGroupIndex] > 1):
                    unsortedGroup[highGroupIndex] = unsortedGroup[highGroupIndex] + unsortedGroup[lowGroupIndex]
                    hashTemp.get(lowIndex)['index'] = abs(highGroupIndex)
                    hashTemp.get(lowIndex)['status'] = abs(hashTemp.get(lowIndex)['status'])
                    del unsortedGroup[lowGroupIndex]
                    continue
                if (unsortedGroup[lowGroupIndex] > 1 and unsortedGroup[highGroupIndex] > 1):
                    continue
            flag = False
            if flag:
                pass
            if (unsortedGroup.get(highGroupIndex) == None and unsortedGroup.get(lowGroupIndex) != None):
                if hashTemp.get(lowIndex)['status'] == -1:
                    hashTemp.get(lowIndex)['index'] = abs(highGroupIndex)
                    hashTemp.get(lowIndex)['status'] = abs(hashTemp.get(lowIndex)['status'])
                    del unsortedGroup[lowGroupIndex]
                    continue
                else:
                    continue
            if (unsortedGroup.get(lowGroupIndex) == None and unsortedGroup.get(highGroupIndex) != None):
                # 2.2.1 high还是白
                if hashTemp.get(highIndex)['index'] == -1:
                    # print(222222222)
                    hashTemp.get(highIndex)['status'] = abs(hashTemp.get(highIndex)['status'])
                    hashTemp.get(highIndex)['index'] = abs(lowGroupIndex)
                    del unsortedGroup[highGroupIndex]
                    continue
                # 不白
                else:
                    continue
            # 双del
            if (unsortedGroup.get(lowGroupIndex) == None and unsortedGroup.get(highGroupIndex) == None):
                continue
        if len(unsortedGroup) <= 7:
            # print(777777777)
            break
            '''版本plus'''
    sortedGroup = sorted(unsortedGroup.items(), key=lambda group: group[1], reverse=True)
    topClusterCenterCount = 0
    for key, _ in sortedGroup:
        topClusterCenterCount += 1
        for point in allNodes['nodes']:
            if point['index'] == key:
                point['index'] = -1 * topClusterCenterCount
        if topClusterCenterCount >= clusterCenterNumber:
            break
    colorStore = ['or', 'og', 'ob', 'oc', 'om', 'oy', 'ok','^r', '^g', '^b', '^c', '^m', '^y', '^k','+r', '+g', '+b', '+c', '+m', '+y','pr', 'pg', 'pb', 'pc', 'pm', 'py','dr', 'dg', 'db', 'dc', 'dm', 'dy']

    plt.figure(figsize=(9, 9), dpi=80)
    for point in allNodes['nodes']:
        # print(point['index'])
        if point['index'] < 0:
            color = colorStore[-1 * point['index'] - 1]
        else:
            color = '+k'
        plt.plot(point['x'],point['y'],color)
    ax = plt.gca()
    ax.xaxis.set_ticks_position('top')
    ax.invert_yaxis()
    plt.show()
    jsonAllNodes = str(allNodes)
    jsonTemp = jsonAllNodes.replace("'",'"')
    return jsonify(jsonTemp)

class KeyValue:
    def __init__(self, key: int, value: Any) -> None:
        self.key: int = key
        self.value: Any = value

class HashTable:
    def __init__(self, capacity: int = 11) -> None:
        self.capacity: int = capacity
        self.length: int = 0
        self.table: List[List[KeyValue]] = [None] * self.capacity
    def put(self, key: int, value: Any) -> int:
        index: int = self.hash(key)
        if self.table[index] is None:
            self.table[index] = [KeyValue(key, value)]
            self.length += 1
        else:
            found: bool = False
            i: int = 0
            items: List[KeyValue] = self.table[index]
            while i < len(items) and not found:
                if items[i].key == key:
                    found = True
                else:
                    i += 1
            if found:
                items[i].value = value
            else:
                items.append(KeyValue(key, value))
                self.length += 1
    def get(self, key: int) -> Any:
        index: int = self.hash(key)
        if self.table[index] is None:
            return None
        else:
            found: bool = False
            i: int = 0
            items: List[KeyValue] = self.table[index]
            while i < len(items) and not found:
                if items[i].key == key:
                    found = True
                else:
                    i += 1
            if found:
                return items[i].value
            else:
                return None
    def contains(self, key: int) -> bool:
        index: int = self.hash(key)
        if self.table[index] is None:
            return False
        else:
            found: bool = False
            i: int = 0
            items: List[KeyValue] = self.table[index]
            while i < len(items) and not found:
                if items[i].key == key:
                    found = True
                else:
                    i += 1
            if found:
                return True
            else:
                return False
    def delete(self, key: int) -> None:
        index: int = self.hash(key)
        if self.table[index] is None:
            return None
        else:
            found: bool = False
            i: int = 0
            items: List[KeyValue] = self.table[index]
            while i < len(items) and not found:
                if items[i].key == key:
                    found = True
                else:
                    i += 1
            if found:
                items.pop(i)
            return None
    def hash(self, key: int) -> int:
        return key % self.capacity
    def size(self) -> int:
        return self.length

if __name__ == '__main__':
    app.debug = False
    app.run(host='localhost', port=5000)