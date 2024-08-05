from web3 import Web3


def get_balance(wallet_address):
    # Replace 'YOUR_INFURA_PROJECT_ID' with your actual Infura project ID
    infura_url = 'https://mainnet.infura.io/v3/ce86902c15364c0695c003699ce6bc20'
    web3 = Web3(Web3.HTTPProvider(infura_url))

    # Check if connected
    if not web3.is_connected():
        print("Failed to connect to the Ethereum network")
        exit()

    # Replace with the wallet address you want to check
    # wallet_address = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'

    # Get the balance (returns balance in Wei)
    balance_wei = web3.eth.get_balance(wallet_address)

    # Convert balance from Wei to Ether
    balance_ether = web3.from_wei(balance_wei, 'ether')

    print(f'Balance of wallet {wallet_address}: {balance_ether} Ether')

    return balance_ether
