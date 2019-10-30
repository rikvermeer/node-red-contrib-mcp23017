module.exports = function(RED) {
    function MCP23017PortNode(config) {
        RED.nodes.createNode(this, config);
        this.chip = RED.nodes.getNode(config.chip);
        this.port = config.port;
        this.direction = config.direction;
        this.init = config.init;

        //Set direction on port
        this.chip.mcp23017.setPortDirection(this.port, this.direction);
        if(this.init && this.init !== -1) {
        	this.chip.mcp23017.writePort(this.port, this.init);
        }
    }
    RED.nodes.registerType("mcp23017-port-in",MCP23017PortNode);
    RED.nodes.registerType("mcp23017-port-out",MCP23017PortNode);
}
