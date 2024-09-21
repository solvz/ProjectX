import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const JobMarketplaceABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "jobId",
        type: "uint256",
      },
    ],
    name: "JobCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "jobId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "employer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "payment",
        type: "uint256",
      },
    ],
    name: "JobCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "jobId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "worker",
        type: "address",
      },
    ],
    name: "JobTaken",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_jobId",
        type: "uint256",
      },
    ],
    name: "completeJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_payment",
        type: "uint256",
      },
    ],
    name: "createJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllJobs",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "employer",
            type: "address",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "payment",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "worker",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isCompleted",
            type: "bool",
          },
        ],
        internalType: "struct JobMarketplace.Job[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_employer",
        type: "address",
      },
    ],
    name: "getEmployerJobs",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "employer",
            type: "address",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "payment",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "worker",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isCompleted",
            type: "bool",
          },
        ],
        internalType: "struct JobMarketplace.Job[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_worker",
        type: "address",
      },
    ],
    name: "getWorkerJobs",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "employer",
            type: "address",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "payment",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "worker",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isCompleted",
            type: "bool",
          },
        ],
        internalType: "struct JobMarketplace.Job[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_jobId",
        type: "uint256",
      },
    ],
    name: "takeJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [takenJobs, setTakenJobs] = useState([]);
  const [listedJobs, setListedJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    payment: "",
  });

  useEffect(() => {
    const init = async () => {
      try {
        // Connect to the local network
        const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // Adjust the port if necessary
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // Replace with your local contract address
        const jobMarketplace = new ethers.Contract(
          contractAddress,
          JobMarketplaceABI,
          signer
        );
        setContract(jobMarketplace);

        console.log("Contract instance:", jobMarketplace);

        // Test a simple read function
        try {
          const allJobs = await jobMarketplace.getAllJobs();
          console.log("All Jobs:", allJobs);
        } catch (error) {
          console.error("Error calling getAllJobs:", error);
        }

        await fetchJobs(jobMarketplace, address);
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    init();
  }, []);

  const fetchJobs = async (jobMarketplace, address) => {
    try {
      console.log("Fetching all jobs...");
      const allJobs = await jobMarketplace.getAllJobs();
      console.log("All jobs:", allJobs);
      setAllJobs(allJobs);

      console.log("Fetching worker jobs...");
      const workerJobs = await jobMarketplace.getWorkerJobs(address);
      console.log("Worker jobs:", workerJobs);
      setTakenJobs(workerJobs);

      console.log("Fetching employer jobs...");
      const employerJobs = await jobMarketplace.getEmployerJobs(address);
      console.log("Employer jobs:", employerJobs);
      setListedJobs(employerJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      console.error("Error details:", error.reason || error.message);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.createJob(
        newJob.title,
        newJob.description,
        ethers.parseEther(newJob.payment)
      );
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Transaction confirmed");
      setNewJob({ title: "", description: "", payment: "" });
      await fetchJobs(contract, account);
    } catch (error) {
      console.error("Error creating job:", error);
      console.error("Error details:", error.reason || error.message);
    }
  };

  const handleTakeJob = async (jobId) => {
    try {
      const tx = await contract.takeJob(jobId);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Transaction confirmed");
      await fetchJobs(contract, account);
    } catch (error) {
      console.error("Error taking job:", error);
      console.error("Error details:", error.reason || error.message);
    }
  };

  return (
    <div className="App">
      <h1>Job Marketplace</h1>
      <p>Connected Account: {account}</p>

      <h2>Create New Job</h2>
      <form onSubmit={handleCreateJob}>
        <input
          type="text"
          placeholder="Job Title"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Job Description"
          value={newJob.description}
          onChange={(e) =>
            setNewJob({ ...newJob, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Payment (ETH)"
          value={newJob.payment}
          onChange={(e) => setNewJob({ ...newJob, payment: e.target.value })}
        />
        <button type="submit">Create Job</button>
      </form>

      <h2>All Available Jobs</h2>
      <ul>
        {allJobs.map((job) => (
          <li key={job.id.toString()}>
            {job.title} - {ethers.formatEther(job.payment)} ETH
            {job.worker === ethers.ZeroAddress && (
              <button onClick={() => handleTakeJob(job.id)}>Take Job</button>
            )}
          </li>
        ))}
      </ul>

      <h2>Your Taken Jobs</h2>
      <ul>
        {takenJobs.map((job) => (
          <li key={job.id.toString()}>
            {job.title} - {ethers.formatEther(job.payment)} ETH
          </li>
        ))}
      </ul>

      <h2>Your Listed Jobs</h2>
      <ul>
        {listedJobs.map((job) => (
          <li key={job.id.toString()}>
            {job.title} - {ethers.formatEther(job.payment)} ETH
            {job.worker !== ethers.ZeroAddress ? " (Taken)" : " (Available)"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
