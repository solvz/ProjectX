import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { FreelanceMarketplaceABI } from './contractABI';

function PostJobComponent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initEthers = async () => {
      // Connect to the local network
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      setProvider(provider);

      // Use the first account provided by Hardhat
      const signer = await provider.getSigner(0);
      setSigner(signer);

      // Your contract ABI (Application Binary Interface)
      const abi = FreelanceMarketplaceABI; // Replace with your contract's ABI

      // Your deployed contract address
      const contractAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Replace with your contract's address

      // Create a contract instance
      const contract = new ethers.Contract(contractAddress, abi, signer);
      setContract(contract);
    };

    initEthers();
  }, []);

  const postJob = async () => {
    if (!contract) {
      console.error('Contract not initialized');
      return;
    }

    try {
      // Convert budget to wei
      const budgetInWei = ethers.parseEther(budget);

      // Call the postJob function
      const transaction = await contract.postJob(title, description, budgetInWei);

      console.log('Transaction sent:', transaction.hash);

      // Wait for the transaction to be mined
      await transaction.wait();

      console.log('Job posted successfully!');

      // Clear the form
      setTitle('');
      setDescription('');
      setBudget('');
    } catch (error) {
      console.error('Error posting job:', error);
    }
  };

  return (
    <div>
      <h2>Post a New Job</h2>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Job Title" 
      />
      <input 
        type="text" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="Job Description" 
      />
      <input 
        type="text" 
        value={budget} 
        onChange={(e) => setBudget(e.target.value)} 
        placeholder="Budget in ETH" 
      />
      <button onClick={postJob}>Post Job</button>
    </div>
  );
}

export default PostJobComponent;
