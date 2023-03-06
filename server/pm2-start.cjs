module.exports = {
  apps : [{
    name   : "listcogs-server",
    script : "npm",
    args: "start",
    watch: ["src"],
    ignore_watch: ["node_modules", "build"]
  }]
}
