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
    # g_b = g_b + 1
    # print(result)
    return jsonify(result)

@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}



if __name__ == '__main__':
    app.debug = False
    app.run(host='localhost', port=5000)