from cmath import log
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
    # mergeRatio = 0.00002

    clusterCenterNumber = 28
    # clusterCenterNumber = 5
    layoutNodesInformation = request.args.get("nodeInformation")
    perNodesInfor = request.args.get("perNodeInformation")
    jsonNodeData = pd.read_json(layoutNodesInformation,orient="records")
    perNodeData = pd.read_json(perNodesInfor,orient="records")

    allNodes = {"nodes":[],"links":[]}
    node_id = jsonNodeData["id"]
    node_x = jsonNodeData["x"]
    node_y = jsonNodeData["y"]
    node_degree = jsonNodeData["degree"]
    node_links = jsonNodeData['links']
    # numberTemp = 0
    for i in range(0,len(jsonNodeData)):
        value = {"id":node_id[i],"x":node_x[i],"y":node_y[i],"group":node_id[i],"index":node_id[i],"degree":node_degree[i],"status":-1,'links':node_links[i]}
        # numberTemp = numberTemp + 1
        allNodes["nodes"].append(value)
    pointsNumber = len(node_id)
    tarSouNumber = len(souTar)
    distanceMap = {}
    node_hash = HashTable()
    hashTemp = node_hash
    for i in allNodes["nodes"]:
        node_hash.put(i["id"],i)
        hashTemp = node_hash      
    
    if(len(perNodeData) > 1):
        perNodes = {"nodes":[],"links":[]}
        pernode_id = perNodeData['id']
        pernode_index = perNodeData['index']
        for i in range(0,len(perNodeData)):
            value = {"id":pernode_id[i],"index":pernode_index[i]}
            perNodes["nodes"].append(value)
        pernode_hash = HashTable()
        perhash_temp = pernode_hash
        for i in perNodes["nodes"]:
            pernode_hash.put(i["id"],i)
            perhash_temp = pernode_hash
        # if(perhash_temp.contains())
        for index in allNodes["nodes"]:
            # print(index['id'])
            if(perhash_temp.contains(index['id'])):
                hashTemp.get(index['id'])['index'] = perhash_temp.get(index['id'])['index']
        for index in allNodes["nodes"]:
            if(perhash_temp.contains(index['id'])==False):
                linkINT = int(hashTemp.get(index['id'])['links'][0])
                hashTemp.get(index['id'])['index'] = hashTemp.get(linkINT)['index']

        jsonAllNodes = str(allNodes)
        jsonTemp = jsonAllNodes.replace("'",'"')
        return jsonify(jsonTemp)

    
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
 
    arrNodesID = []
    for index in allNodes["nodes"]:
        arrNodesID.append(index["id"])

    unsortedGroup = {index:1 for index in arrNodesID}

    for key,_ in distanceMap:
        lowIndex, highIndex = int(key.split("#")[0]), int(key.split("#")[1])
        lowGroupIndex = hashTemp.get(lowIndex)["index"]
        highGroupIndex = hashTemp.get(highIndex)["index"]
        if hashTemp.get(lowIndex)["index"] != hashTemp.get(highIndex)["index"]:
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
                            hashTemp.get(highIndex)['status'] = abs(hashTemp.get(highIndex)['status'])
                            hashTemp.get(highIndex)['index'] = abs(lowGroupIndex)
                            del unsortedGroup[highGroupIndex]
                            continue
                        # 不白
                        else:
                            continue
                    # 双del
                    if (unsortedGroup.get(lowGroupIndex) == None and unsortedGroup.get(highGroupIndex) == None):
                        if(unsortedGroup[lowGroupIndex] < 2 or unsortedGroup[highGroupIndex] < 2):
                            if (unsortedGroup[lowGroupIndex] > unsortedGroup[highGroupIndex]):
                                for index in allNodes["nodes"]:
                                    if (index["index"] == highGroupIndex):
                                        hashTemp.get(index["id"])["index"] = abs(lowGroupIndex)
                            else:
                                for index in allNodes["nodes"]:
                                    if (index["index"] == lowGroupIndex):
                                        hashTemp.get(index["id"])["index"] = abs(highGroupIndex)
                        




        if len(unsortedGroup) <= 7:
            break 
        # if len(unsortedGroup) <= 3:
        #     break 

    sortedGroup = sorted(unsortedGroup.items(), key=lambda group: group[1], reverse=True)
    topClusterCenterCount = 0
    for key, _ in sortedGroup:
        topClusterCenterCount += 1
        for point in allNodes['nodes']:
            if point['index'] == key:
                point['index'] = -1 * topClusterCenterCount
        if topClusterCenterCount >= clusterCenterNumber:
            break
    
    jsonAllNodes = str(allNodes)
    jsonTemp = jsonAllNodes.replace("'",'"')
   
    return jsonify(jsonTemp)


@app.route('/api/testSort')
def test_SortedData():
    try:  
        with open('files/sortedData/sortedData.json') as fi:
            result = json.load(fi)
            # print(result)
            return jsonify(result)
    except:
        return jsonify({})


@app.route('/api/Sorted')
def test_SortedData111():
    try:  
        with open('files/sortedData/sorted.txt') as fi:
            print(fi)
            return fi
    except:
        return 0


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