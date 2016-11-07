module.exports = {
    parseSortString: (sortString, defaultSort) => {
        let s = sortString || defaultSort || '';
        let result = {
            column: '',
            direction: 'asc'
        };
        //split string on space character into an array of tokens
        s = s.split(' ');
        //if no tokens return null
        if (s.length < 1) {
            return null;
        }
        //if atleast 1 token, set the sort column as 1st token
        result.column = s[0];
        //if column is empty, return null
        if (!result.column) {
            return null;
        }
        //if only 1 token, return result that sorts by that column in ASC direction
        if (s.length === 1) {
            return result;
        }
        //if more than 1 token, check if 2nd token is requesting a DESC direction
        if (s[1].toLowerCase() === 'desc') {
            result.direction = 'desc';
        }
        return result;
    },

    idToMMObjArr: (arrFieldName, idArray, otherFieldName, otherId) => {
        return idArray.map((obj) => {
            let x = {};
            x[arrFieldName] = obj;
            x[otherFieldName] = otherId;
            return x;
        });
    },
    //returns an object with the add/delete changes to make to a M:M table given the new/existing ids
    getMMDelta: (newIds, currentIds, variableFieldName, constFieldName, constantId) => {
        let i, ii, add = [], del = [], x;

        //look for ids in newIds that are not in currentIds, these will be ADDS ([] of m:m objects)
        for (i = 0, ii = newIds.length; i < ii; i++) {
            if (currentIds.indexOf(newIds[i]) == -1) {
                x = {};
                x[variableFieldName] = newIds[i];
                x[constFieldName] = constantId;
                add.push(x);
            }
        }
        //look for ids in currentIds that are not in newIds, these will be DELETES ([] of ids only)
        for (i = 0, ii = currentIds.length; i < ii; i++) {
            if (newIds.indexOf(currentIds[i]) == -1) {
                del.push(currentIds[i]);
            }
        }

        return { add: add, del: del };
    }
};