module.exports = require('../fields').property({
    chart: {
        title: "Sample chart",
        type: "Bar",
        style: "Vertical",
        format: "3D",
        data: [
            { "a":250, "b":130, "c":140, "d":25},
            { "a":300, "b":110, "c":190, "d":42},
            { "a":350, "b":190, "c":120, "d":35},
            { "a":150, "b":100, "c":170, "d":15}
        ]
    }
});
