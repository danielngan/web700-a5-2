const themeData = require("../data/themeData.json");

class LegoData {
    sets;
    themes;

    constructor() {
        this.sets = [];
        this.themes = [];
    }

    initialize() {

        const setData = require("../data/setData");
        const themeData = require("../data/themeData");
        return new Promise((resolve, reject) => {
            setData.forEach(setElement => {
                let setWithTheme = { ...setElement, theme: themeData.find(themeElement => themeElement.id == setElement.theme_id).name }
                this.sets.push(setWithTheme);
            });
            this.themes = [...themeData]
            resolve();
        });

    }

    getAllThemes() {
        return new Promise((resolve, reject) => {
            resolve(this.themes);
        });
    }

    getThemeById(id) {
        return new Promise((resolve, reject) => {
            let foundTheme = this.themes.find(t => t.id === id);

            if (foundTheme) {
                resolve(foundTheme)
            } else {
                reject("Unable to find requested theme");
            }

        });
    }

    getAllSets() {
        return new Promise((resolve, reject) => {
            resolve(this.sets);
        });
    }

    getSetByNum(setNum) {

        return new Promise((resolve, reject) => {
            let foundSet = this.sets.find(s => s.set_num === setNum);

            if (foundSet) {
                resolve(foundSet)
            } else {
                reject("Unable to find requested set");
            }

        });

    }

    addSet(newSet){
        
        return new Promise((resolve,reject)=>{
            let foundSet = this.sets.find(s => s.set_num === newSet.set_num);

            if (foundSet) {
                reject("Set already exists");
            } else {
                this.sets.push(newSet);
                resolve();
            }
        });

    }


    getSetsByTheme(theme) {

        return new Promise((resolve, reject) => {
            let foundSets = this.sets.filter(s => s.theme.toUpperCase().includes(theme.toUpperCase()));
            if (foundSets) {
                resolve(foundSets)
            } else {
                reject("Unable to find requested sets");
            }
        });
    }

    deleteSetByNum(set_num) {
        return new Promise((resolve, reject) => {
            const index = this.sets.findIndex(item => item.set_num === set_num);
            if (index !== -1) {
                this.sets.splice(index, 1);
                resolve();
            } else {
                reject("set not found");
            }
        })
    }
}

module.exports = LegoData;

