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
    duplicateMap = {};
    public path1 = config.paths.dest;
    public path2 = config.paths.path2;
    counter = 1
    duplicatesArray = []
    checkMap = {};
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
    async  comparePathsArray(array1) {
        console.log("Resources found : ")
        console.log(array1)
        var self = this
        var counter = 0
        return new Promise(async (resolve, reject) => {
            for (let outer_index = 0; outer_index < array1.length; outer_index++) {
                const element = array1[outer_index];

                for (let inner_index = outer_index + 1; inner_index < array1.length; inner_index++) {
                    const element2 = array1[inner_index];
                    if (!this.checkMap[element2])
                        await this.compare2Paths(element, element2)

                }
            }
            resolve()
        })
    }
    async startProcessing() {
        let self = this
        function purifier(array) {
            var purifiedArray = array.filter(function (path) {
                var paths_array = path.split("\\")
                return !(paths_array[paths_array.length - 1] == "task.xml" || paths_array[paths_array.length - 1] == "practice.json")
            })
            return purifiedArray
        }
        var array1 = await this.pathFinder(this.path1)

        await this.comparePathsArray(array1)

        await this.prepareResult()

        // this.moveResource("duplicate")

    }
    prepareResult() {
        return new Promise((resolve, reject) => {
            var counter = 0;
            for (var key in this.duplicateMap) {
                this.duplicatesArray.push([])
                this.duplicatesArray[counter].push(key)
                this.duplicateMap[key].forEach(element => {
                    this.duplicatesArray[counter].push(element)
                });
                counter++;
            }
            //console.log(this.map_result)
            createCSVFile('result.csv', this.duplicatesArray);
            resolve(this.duplicateMap)
        })

    }
    async compare2Paths(path1: string, path2: string) {

        var self = this
        return new Promise(async (resolve, reject) => {

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

            if (ext_check(path1, path2) && size_check(path1, path2)) {
                var res = await compare.compareExtensionType(path1, path2, path.extname(path1));
                if (res) {

                    self.checkMap[path2] = true

                    if (this.duplicateMap[path1] == undefined) {
                        this.duplicateMap[path1] = []
                    }
                    this.duplicateMap[path1].push(path2);

                    this.counter++;
                    resolve()
                }

            }
            resolve()
        })



    }
    moveFile(src: string, dest: string) {

        var files_to_copy_array = src.split("\\");
        var filename = files_to_copy_array[files_to_copy_array.length - 1]
        fsMover.move(src, dest + "/" + filename);
    }
    moveResource(type: string) {
        let self = this
        function resourseToMove(resourseArray, dest) {

            resourseArray.forEach(element => {
                self.moveFile(element, dest);
            });
        }
        if (type == "duplicate") {
            var dest2 = config.paths.dest + "/trash"

            for (var key in this.duplicateMap) {
                resourseToMove(this.duplicateMap[key], dest2);
            }

        }
    }
    driver() {
        return new Promise(async (resolve, reject) => {
            let self = this;

            await self.clearDest(config.paths.dest + "/trash")
            await self.startProcessing()
        
            resolve()

        })
    }
}