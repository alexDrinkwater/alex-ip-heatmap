const protobuf = require('protobufjs');

let protodef = {
    init: init
}

function init() {
    const root = protobuf.loadSync('server/proto/ip.proto');

    const Ips = root.lookupType('ippackage.Ips');
    const Ip = root.lookupType('ippackage.Ip');

    return { ips: Ips, ip: Ip };
}

module.exports = protodef;
