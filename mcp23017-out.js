module.exports = function(RED) {
    function MCP23017OutNode(config) {
        RED.nodes.createNode(this, config);

        this.port = RED.nodes.getNode(config.port);
        this.mcp23017 = this.port.chip.mcp23017;
        this.regex = /pin_(\d)/

        var node = this;
        node.on('input', function(msg) {
            const topicRegex = this.regex.exec(msg.topic)
            //Input is array of pins (8)
            if(msg.payload instanceof Array) {
                for(let i = 0; i < msg.payload.length; i++) {
                    //payload can be a number or an opbject
                    if(Number.isInteger(msg.payload[i])) {
                        //payload can be 0 or false
                        const value = (!msg.payload[i] ? 0 : 1);
                        node.mcp23017.writePin(i, value);
                    } else if(
                            msg.payload[i] instanceof Object && 
                            msg.payload[i].hasOwnAttribute('pin') && 
                            Number.isInteger(msg.payload[i].pin) &&
                            Number(msg.payload[i].pin >= 0) &&
                            Number(msg.payload[i].pin < 8)) {
                        //payload[i] is an object {pin: 0, value: ..} 
                        const pin = Number(msg.payload[i].pin);
                        const value = (!msg.payload[i].value ? 0 : 1);
                        node.mcp23017.writePin(pin, value);
                    } else {
                        //throw error
                        msg.error = "Array provided with invalid content";
                    }
                    
                }
            //Payload is an object { "bla": {"pin":0, }}
            } else if(msg.payload instanceof Object) {
                for(entry of msg.payload) {
                    if(entry.pin >= 0 && entry.pin < 8) {
                        const value = (!entry.value[i] ? 0 : 1);
                        node.mcp23017.writePin(entry.pin, value);
                    }
                }
            } else if(msg.topic && topicRegex) {
                // Something like pin_3
                const pin = Number(topicRegex[1]);
                const value = (!msg.payload[i] ? 0 : 1);
                node.mcp23017.writePin(pin, value);
            } else if(Number.isInteger(msg.payload) && Number(msg.payload) >= 0 && Number(msg.payload) <= 255) {
                node.mcp23017.writePort(this.port.port, Number(msg.payload));
            } else {
                //throw error
                msg.error = "None of the payload checks were valid";
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType("mcp23017-out",MCP23017OutNode);
}
