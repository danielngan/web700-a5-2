require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');
const themeData = require("../data/themeData.json");
const setData = require("../data/setData.json");

class LegoData {
    sequelize;
    Set;
    Theme;

    constructor() {
        this.sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', 'r2eA9QVWZdno', {
            host: 'ep-wandering-tree-a58tp0jk.us-east-2.aws.neon.tech',
            dialect: 'postgres',
            port: 5432,
            dialectOptions: {
                ssl: { rejectUnauthorized: false },
            },
        });
        this.Theme = this.sequelize.define('Theme', {
            id: {
                type: Sequelize.INTEGER,       // Data type for the column
                allowNull: false,              // Whether null values are allowed
                primaryKey: true,              // Mark as primary key
                autoIncrement: true,           // Enable auto-increment
            },
            name: {
                type: Sequelize.STRING,        // String type with default length
                allowNull: false,              // Disallow null values
            },
        }, {
            createdAt: false, // disable createdAt
            updatedAt: false, // disable updatedAt
        });

        this.Set = this.sequelize.define('Set', {
            set_num: {
                type: Sequelize.STRING,       // Data type for the column
                             // Whether null values are allowed
                primaryKey: true,              // Mark as primary key
            },
            name: {
                type: Sequelize.STRING,        // String type with default length
            },
            year: {
                type: Sequelize.INTEGER,          // Text type for larger strings
            },
            num_parts: {
                type: Sequelize.INTEGER,          // Date type
            },
            theme_id: {
                type: Sequelize.INTEGER,          // Date type
            },
            img_url: {
                type: Sequelize.STRING,
            },

        }, {
            createdAt: false, // disable createdAt
            updatedAt: false, // disable updatedAt
        });

        this.Set.belongsTo(this.Theme, {foreignKey: 'theme_id'});
// Code Snippet to insert existing data from Set / Themes

        // const setData = require("../data/setData");
        // const themeData = require("../data/themeData");
        //
        // this.sequelize
        //     .sync()
        //     .then( async () => {
        //         try{
        //             await this.Theme.bulkCreate(themeData);
        //             await this.Set.bulkCreate(setData);
        //             console.log("-----");
        //             console.log("data inserted successfully");
        //         }catch(err){
        //             console.log("-----");
        //             console.log(err.message);
        //
        //             // NOTE: If you receive the error:
        //
        //             // insert or update on table "Sets" violates foreign key constraint "Sets_theme_id_fkey"
        //
        //             // it is because you have a "set" in your collection that has a "theme_id" that does not exist in the "themeData".
        //
        //             // To fix this, use PgAdmin to delete the newly created "Themes" and "Sets" tables, fix the error in your .json files and re-run this code
        //         }
        //
        //         process.exit();
        //     })
        //     .catch((err) => {
        //         console.log('Unable to connect to the database:', err);
        //     });
    }

    async initialize() {
        try {
            this.sequelize.sync()
            console.log('Database synchronized successfully.');
        } catch (error) {
            console.error('Failed to synchronize the database:', error);
            throw error
        }
        // console.log("Initializing LegoData")
        // const setData = require("../data/setData");
        // const themeData = require("../data/themeData");
        // setData.forEach(setElement => {
        //     let setWithTheme = {
        //         ...setElement,
        //         theme: themeData.find(themeElement => themeElement.id === setElement.theme_id).name
        //     }
        //     this.sets.push(setWithTheme);
        // });
        // this.themes = [...themeData]
    }

    getAllThemes() {
        return new Promise((resolve, reject) => {
            this.Theme.findAll()
                .then((theme) => {
                    // Resolve the promise with the retrieved sets
                    resolve(theme);
                })
                .catch((error) => {
                    // Reject the promise if there's an error
                    console.error('Error retrieving themes:', error);
                    reject(error);
                });
        });
    }

    // getThemeById(id) {
    //     return new Promise((resolve, reject) => {
    //         let foundTheme = this.themes.find(t => t.id === id);
    //
    //         if (foundTheme) {
    //             resolve(foundTheme)
    //         } else {
    //             reject("Unable to find requested theme");
    //         }
    //
    //     });
    // }

    getAllSets() {
        // return new Promise((resolve, reject) => {
        //     resolve(this.sets);
        // });
        return new Promise((resolve, reject) => {
            this.Set.findAll()
                .then((sets) => {
                    // Resolve the promise with the retrieved sets
                    resolve(sets);
                })
                .catch((error) => {
                    // Reject the promise if there's an error
                    console.error('Error retrieving sets:', error);
                    reject(error);
                });
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
          this.Set.create(newSet)
              .then(newSet => {
                  resolve(newSet); // Resolve the promise with the new set
              })
              .catch(error => {
                  reject(err.errors[0].message); // Reject the promise with the error
              });
        });

    }


    getSetsByTheme(theme) {

        // return new Promise((resolve, reject) => {
        //     let foundSets = this.sets.filter(s => s.theme.toUpperCase().includes(theme.toUpperCase()));
        //     if (foundSets) {
        //         resolve(foundSets)
        //     } else {
        //         reject("Unable to find requested sets");
        //     }
        // });

        return new Promise((resolve, reject) => {
            this.Set.findAll({
                include: [this.Theme],
                where: {
                    '$Theme.name$': {
                        [Sequelize.Op.iLike]: `%${theme}%`
                    }
                }
            })
                .then(results => {
                    resolve(results); // Resolve the promise with the results
                })
                .catch(error => {
                    reject(error); // Reject the promise with the error
                });
        });
    }

    deleteSetByNum(set_num) {
        return new Promise((resolve, reject) => {
            // const index = this.sets.findIndex(item => item.set_num === set_num);
            // if (index !== -1) {
            //     this.sets.splice(index, 1);
            //     resolve();
            // } else {
            //     reject("set not found");
            // }
            this.Set.destroy({
                where: { set_num: 3 },
            }).then(() => {
                console.log('successfully removed Set');
            }).catch(error => {
                reject( err.errors[0].message );
            })
        })
    }
}

module.exports = LegoData;

