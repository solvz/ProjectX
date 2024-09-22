import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { JobMarketplaceABI } from "./JobMarketplaceABI.js";

const contractABI = JobMarketplaceABI;
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const jobStatusMapping = {
  0: "Open",
  1: "InProgress",
  2: "Completed",
  3: "Cancelled",
  4: "Disputed",
};

const App = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    payment: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingJobId, setLoadingJobId] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          setLoading(true);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const jobMarketplace = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setContract(jobMarketplace);

          await refreshJobs(jobMarketplace);
          setLoading(false);
        } catch (error) {
          console.error("An error occurred:", error);
          setError(
            "Failed to connect to the blockchain. Please make sure you're connected to the correct network."
          );
          setLoading(false);
        }
      } else {
        setError("Please install MetaMask to use this application.");
        setLoading(false);
      }
    };

    init();
  }, []);

  const refreshJobs = async (contractInstance) => {
    const allJobs = await contractInstance.getAllJobs();
    setJobs(allJobs);
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!contract) return;

    try {
      setLoading(true);
      setError("");

      console.log("Creating job with parameters:", {
        title: newJob.title,
        description: newJob.description,
        payment: newJob.payment,
      });

      // Ensure the payment is a valid number
      const paymentInWei = ethers.parseEther(newJob.payment.toString());
      console.log("Payment in Wei:", paymentInWei.toString());

      // Log the contract method we're calling
      console.log("Calling contract method: createJob");

      const tx = await contract.createJob(newJob.title, newJob.description, {
        value: paymentInWei,
        gasLimit: 500000, // Increased gas limit
      });

      console.log("Transaction sent:", tx.hash);
      console.log("Waiting for transaction to be mined...");

      const receipt = await tx.wait();
      console.log("Transaction mined. Receipt:", receipt);

      console.log("Job created successfully!");

      await refreshJobs(contract);
      setNewJob({ title: "", description: "", payment: "" });
    } catch (error) {
      console.error("Detailed error:", error);

      let errorMessage = "Failed to create job. ";
      if (error.reason) {
        errorMessage += error.reason;
      } else if (error.message) {
        errorMessage += error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeJob = async (jobId) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.takeJob(jobId, { gasLimit: 3000000 });
      await tx.wait();
      console.log("Job Taken successfully!");

      await refreshJobs(contract);
      setLoading(false);
    } catch (error) {
      console.error("Error taking job:", error);
      setError("Failed to take job. Please try again.");
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.cancelJob(jobId);
      await tx.wait();
      console.log("Job Deleted successfully!");

      await refreshJobs(contract);
      setLoading(false);
    } catch (error) {
      console.error("Error Deleting job:", error);
      setError("Failed to delete job. Please try again.");
      setLoading(false);
    }
  };

  const fundJob = async (jobId) => {
    if (!contract) return;
    try {
      setLoading(true);
      const tx = await contract.releasePayment(jobId, { gasLimit: 300000 });
      await tx.wait();
      console.log("Payment released successfully!");
      await refreshJobs(contract);
    } catch (error) {
      console.error("Error releasing payment:", error);
      setError("Failed to release payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleCompleteJob = async (jobId) => {
    if (!contract) return;
    try {
      setLoadingJobId(jobId);
      setError("");
      const tx = await contract.completeJob(jobId, { gasLimit: 300000 });
      await tx.wait();
      console.log("Job completed successfully!");
      await refreshJobs(contract);
    } catch (error) {
      console.error("Error completing job:", error);
      setError("Failed to complete job. Please try again.");
    } finally {
      setLoadingJobId(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Project X</h1>
      <p>Connected Account: {account}</p>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <h2>Create New Job</h2>
        <form
          onSubmit={handleCreateJob}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Job Title"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            required
            style={{ padding: "5px" }}
          />
          <textarea
            placeholder="Job Description"
            value={newJob.description}
            onChange={(e) =>
              setNewJob({ ...newJob, description: e.target.value })
            }
            required
            style={{ padding: "5px", minHeight: "100px" }}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Payment (in ETH)"
            value={newJob.payment}
            onChange={(e) => setNewJob({ ...newJob, payment: e.target.value })}
            required
            style={{ padding: "5px" }}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              cursor: "pointer",
              disabled: loading,
            }}
          >
            {loading ? "Creating..." : "Create Job"}
          </button>
        </form>
      </div>

      <h2>Available Jobs</h2>
      <div>
        {jobs.map((job, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "5px",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>{job.title}</h3>
            <p style={{ marginBottom: "5px" }}>{job.description}</p>
            <p style={{ marginBottom: "5px" }}>
              Payment: {ethers.formatEther(job.payment)} ETH
            </p>
            <p style={{ marginBottom: "10px" }}>
              Status: {jobStatusMapping[job.status]}
            </p>
            {/*{job.status === 0 && (*/}
            <button
              onClick={() => handleTakeJob(job.id)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#008CBA",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              disabled={loading}
            >
              {loading ? "Taking..." : "Take Job"}
            </button>
            {/* )} */}
            {job.employer === account && (
              <>
                <button
                  onClick={() => deleteJob(job.id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete Job"}
                </button>
                <button
                  onClick={() => fundJob(job.id)} // Example amount to fund
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                  disabled={loading}
                >
                  {loading ? "Funding..." : "Fund Job"}
                </button>
              </>
            )}

            <button
              onClick={() => handleCompleteJob(job.id)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                cursor: "pointer",
                marginLeft: "10px",
              }}
              disabled={loading}
            >
              {loading ? "Funding..." : "Complete Job"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
