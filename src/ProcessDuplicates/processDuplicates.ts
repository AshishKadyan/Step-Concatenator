import { extname } from "path";
import { promises } from "fs";
import { resolve } from "url";
import { rejects } from "assert";
var compare = require('./compare')
var fsMover = require('fs-extra');
const createCSVFile = require('csv-file-creator');
const fs = require('fs');
const filehound = require('filehound');
var config = require('../../config');
var path = require('path')
var rimraf = require('rimraf');

export default class processDuplicates {
    map_result = {};
    public path1 = config.paths.dest;
    public path2 = config.paths.path2;
    counter = 1
    result = []
    check_map = {};

    pathFinder(path: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const files = filehound.create()
                .paths(path)
                .find();
            //  console.log(files)
            resolve(files)
        });
    }
    clearDest(dest) {
        return new Promise((resolve, reject) => {
            rimraf(dest, function () {
                console.log('cleaned up ' + dest + ' directory');
                resolve();
            });
        })

    }
    constructTask() {
        let self=this
        function purifier(array) {
            var purifiedArray = array.filter(function (path) {
                var paths_array = path.split("\\")
                return !(paths_array[paths_array.length - 1] == "task.xml" || paths_array[paths_array.length - 1] == "practice.json")
            })
            return purifiedArray
        }

        Promise.all([this.pathFinder(this.path1), this.pathFinder(this.path2)]).then(values => {
            var array1 = purifier(values[0])
            var array2 = purifier(values[1])
            array1.forEach((element, outer_index) => {
                array1.forEach((element2, inner_index) => {
                    if (inner_index > outer_index) {
                        if (!this.check_map[element2])
                            this.comparer(element, element2) //compare files in folder asset2
                    }

                })
            });
        }).then(function () {
            self.prepareResult()
        }).then(function () {
            self.moveResource("duplicate")
        })
    }
    prepareResult() {
        console.log("here")
        var counter = 0;
        for (var key in this.map_result) {
            this.result.push([])
            this.result[counter].push(key)
            this.map_result[key].forEach(element => {
                this.result[counter].push(element)
            });
            counter++;
        }
        console.log(this.map_result)
        createCSVFile('result.csv', this.result);

    }
    comparer(path1: string, path2: string): void {
        var ext_check = function (path1, path2) {
            return (path.extname(path1) == path.extname(path2))
        }
        var size_check = function (path1, path2) {
            const stats = fs.statSync(path1)
            const fileSizeInBytes = stats.size
            const stats1 = fs.statSync(path2)
            const fileSizeInBytes1 = stats1.size
            return (fileSizeInBytes == fileSizeInBytes1)
        }

        if (ext_check(path1, path2) && size_check(path1,path2) && compare.compareExtensionType(path1, path2, path.extname(path1))) {
            this.check_map[path2] = true
            if (this.map_result[path1] == undefined) {
                this.map_result[path1] = []
            }
            this.map_result[path1].push(path2);
            this.counter++;
        }
    }
    moveFile(src: string, dest: string) {

        var files_to_copy_array = src.split("\\");
        var filename = files_to_copy_array[files_to_copy_array.length - 1]
        fsMover.move(src, dest + "/" + filename);
    }
    moveResource(type: string) {
        let self=this
        function resourseToMove(resourseArray, dest) {
  
            resourseArray.forEach(element => {
                self.moveFile(element, dest);
            });
        }
        if (type == "duplicate") {
            var dest2 = config.paths.dest + "/trash"

            for (var key in this.map_result) {
                resourseToMove(this.map_result[key], dest2);
            }

        }
    }
    driver() {
        let self = this;
 
        self.clearDest(config.paths.dest + "/trash").then(function () {
            self.constructTask();
        });
    }
}