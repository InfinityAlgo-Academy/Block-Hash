import { Interface } from 'ethers';

export class AbiRegistry {
    private interfaces: Map<string, Interface> = new Map();

    register(name: string, abi: any[]) {
        this.interfaces.set(name, new Interface(abi));
    }

    get(name: string): Interface | undefined {
        return this.interfaces.get(name);
    }

    decodeLog(name: string, data: string, topics: string[]) {
        const iface = this.interfaces.get(name);
        if (!iface) throw new Error(`ABI ${name} not found`);
        return iface.parseLog({ data, topics });
    }

    decodeFunction(name: string, data: string) {
        const iface = this.interfaces.get(name);
        if (!iface) throw new Error(`ABI ${name} not found`);
        return iface.parseTransaction({ data });
    }
}

export const abiRegistry = new AbiRegistry();

// Initialize basic ABIs
const erc20Abi = [
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
    "function transfer(address to, uint amount) returns (bool)",
    "function transferFrom(address sender, address recipient, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)"
];

const nftAbi = [
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
    "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)"
];

abiRegistry.register('ERC20', erc20Abi);
abiRegistry.register('ERC721', nftAbi);
