import { encode, reconstruct } from 'wasm-reed-solomon-erasure';

export const bufferToShards = (buf: Buffer, shardsCount = 10, parityShards = 2): Uint8Array[] => {
    const dataShards = shardsCount - parityShards;

    const input = new Uint8Array(buf);

    const shardSize = Math.ceil(input.length / dataShards);
    const shardData: Uint8Array[] = [];

    for (let i = 0; i < dataShards; i++) {
        const array = new Uint8Array(shardSize);
        shardData.push(array);
    }

    for (let i = 0; i < input.length; i++) {
        const j = Math.floor(i / shardSize);
        const k = i % shardSize;
        shardData[j][k] = input[i];
    }
    return encode(shardData, parityShards);
};


export const shardsToBuffer = (shards: Uint8Array[], parityCnt: number): Buffer => {
    let deadIdx: number[] = []
    shards.forEach((shard, i) => {
        if (shard.length < 1)
            deadIdx.push(i)
    })

    const result = reconstruct(shards, parityCnt, new Uint32Array(deadIdx));

    const flatten: number[] = [];
    const dataShardsCnt = shards.length - parityCnt;
    for (let i = 0; i < dataShardsCnt; i++) {
        for (const value of result[i]) flatten.push(value);
    }
    return Buffer.from(flatten);
};




function testObject() {
    const origin = {
        '@context': ['https://www.w3.org/2018/credentials/v1', 'https://schema.org'],
        id: 'did:infra:space:5FDseiC76zPek2YYkuyenu4ZgxZ7PUWXt9d19HNB5CaQXt5U',
        type: ['VerifiableCredential', 'VaccinationCredential'],
        credentialSubject: {
            id: 'did:infra:space:5CfVpNJWhHeeb8EWhwKzUk3phDNtUNigCAjnSBYD7S6MnD2d',
            테스트: '123',
            alumniOf: 'Example University',
            email: 'test@test.com',
        },
        issuanceDate: '2023-03-22T06:51:36.019Z',
    };
    test(JSON.stringify(origin))

}

function test(origin = 'Hello World') {
    const shardCnt = 5
    const parityCnt = 2

    console.log('origin:', origin)
    const buf = Buffer.from(origin);
    console.log('origin to buffer: ', buf);
    const shards = bufferToShards(buf, shardCnt, parityCnt);
    console.log(`bufferToShards(${shardCnt} + ${parityCnt})`, shards);
    const corrupted = [...shards];
    // Shard Destruction
    for (let i = 0; i < parityCnt; i++) {
        const idx = Math.floor(Math.random() * (shardCnt));
        corrupted[idx] = new Uint8Array();
    }

    console.log('corrupted shards: ', corrupted);
    const restoredBuffer = shardsToBuffer(corrupted, parityCnt);
    console.log('restore buffer: ', restoredBuffer)
    const array = new Uint8Array(restoredBuffer);
    const restored = Buffer.from(array).toString().replace(/\0/g, '');
    console.log('restored: ', restored.trim())
    console.log('erasure: ', JSON.stringify(restored) === JSON.stringify(origin))
    return restored

}

test()
// testObject()
