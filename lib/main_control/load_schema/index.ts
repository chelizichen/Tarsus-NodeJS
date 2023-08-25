const fastJson = require('fast-json-stringify')
const load_schema = {
    dtoMaps: {}
}

function typeMapping(type, mapData) {
    switch (type) {
        case 'int': return {type:'number'};
        case 'string': return {type:'string'};
        default:
            // If the type exists in mapData, then return the appropriate schema.
            if (mapData.has(type)) {
                return generateSchemaFromMap(new Map([[type, mapData.get(type)]]))[type];
            } else {
                throw new Error(`Unsupported type: ${type}`);
            }
    }
}

function generateSchemaFromMap(mapData) {
    let result = {};

    for (let [key, value] of mapData) {
        result[key] = {
            type: 'object',
            properties: {}
        };
        for (let item of value) {
            const { param, type } = item;
            if (type.startsWith('List<') && type.endsWith('>')) {
                const listItemType = type.slice(5, type.length - 1);
                if (mapData.has(listItemType)) {
                    result[key].properties[param] = {
                        type: 'array',
                        items: generateSchemaFromMap(new Map([[listItemType, mapData.get(listItemType)]]))[listItemType]
                    };
                } else {
                    try {
                        // If the list type is a basic type, like 'string' or 'int'
                        result[key].properties[param] = {
                            type: 'array',
                            items: { type: typeMapping(listItemType, mapData) }
                        };
                    } catch (e) {
                        throw new Error(`Missing definition for type ${listItemType}`);
                    }
                }
            } else {
                result[key].properties[param] = typeMapping(type, mapData);
            }
        }
    }

    return result;
}

function FastStringify(response: string, data: Record<string, any>): string {
    debugger;
    const response$dto = load_schema.dtoMaps[response];
    /**
     * 
data: {
  code: 0,
  data: { address: '1', age: '11', id: '11', fullName: '11', name: '11' },
  message: 'asdasdsad'
}
response$dto :{
  type: "object",
  properties: {
    code: "number",
    data: {
      type: "object",
      properties: {
        id: "string",
        name: "string",
        age: "string",
        fullName: "string",
        address: "string",
      },
    },
    message: "string",
  },
}
     */
// const response$dto = {
//     type: "object",
//     properties: {
//         code: { type: "number" },
//         data: {
//             type: "object",
//             properties: {
//                 id: { type: "string" },
//                 name: { type: "string" },
//                 age: { type: "string" },
//                 fullName: { type: "string" },
//                 address: { type: "string" },
//             },
//         },
//         message: { type: "string" },
//     },
// }
    const toStringify = fastJson(response$dto)
    /**
err:{
    (node:74261) UnhandledPromiseRejectionWarning: TypeError [ERR_INVALID_ARG_TYPE]: The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Received an instance of Error
}
     */
    return toStringify(data);
}



export {
    generateSchemaFromMap,
    typeMapping,
    FastStringify
}

export default load_schema