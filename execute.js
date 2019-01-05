async function execute(method, params) {
    console.log(method, params)
    console.log({
        username: this.username,
        password: this.password,
        uri: this.uri
    })
    const res = await request({
        method: 'POST',
        uri: this.uri,
        // pool: true,
        json: {
            method: method,
            params: params,
            id: this.id++.,./,.
        },
        auth: {
            username: this.username,
            password: this.password
        }
    });

    console.log('ERROR URI = ', this.uri)
    if (res.statusCode === 401)
        throw new RPCError('Unauthorized (bad API key).', -1);

    // if (res.statusCode !== 200)
    //     throw new Error(`Status code: ${res.statusCode}.`);

    if (res.type !== 'json')
        throw new Error('Bad response (wrong content-type).');

    if (!res.body)
        throw new Error('No body for JSON-RPC response.');

    if (res.body.error)
        throw new RPCError(res.body.error.message, res.body.error.code);

    return res.body.result;
};
