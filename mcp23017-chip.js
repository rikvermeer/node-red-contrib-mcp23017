module.exports = function(RED) {
	const mcp23017 = require('mcp23017');

    function MCP23017ChipNode(config) {
        RED.nodes.createNode(this,config);
        this.i2c_bus = config.i2c_bus;
        this.i2c_address = config.i2c_address;
        this.mcp23017 = new mcp23017(this.i2c_bus, this.i2c_address);
    }
    RED.nodes.registerType("mcp23017-chip",MCP23017ChipNode);
}
