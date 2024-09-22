export const JobMarketplaceABI = [
    {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "jobId",
            "type": "uint256"
          }
        ],
        "name": "DisputeRaised",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "jobId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "winner",
            "type": "address"
          }
        ],
        "name": "DisputeResolved",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "jobId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "FundsReleased",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "jobId",
            "type": "uint256"
          }
        ],
        "name": "JobCancelled",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "jobId",
            "type": "uint256"
          }
        ],
        "name": "JobCompleted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "jobId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "employer",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "payment",
            "type": "uint256"
          }
        ],
        "name": "JobCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "jobId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "freelancer",
            "type": "address"
          }
        ],
        "name": "JobTaken",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_jobId",
            "type": "uint256"
          }
        ],
        "name": "cancelJob",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_jobId",
            "type": "uint256"
          }
        ],
        "name": "completeJob",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_description",
            "type": "string"
          }
        ],
        "name": "createJob",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "employerJobs",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "freelancerJobs",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAllJobs",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "address payable",
                "name": "employer",
                "type": "address"
              },
              {
                "internalType": "address payable",
                "name": "freelancer",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "title",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "payment",
                "type": "uint256"
              },
              {
                "internalType": "enum JobMarketplace.JobStatus",
                "name": "status",
                "type": "uint8"
              },
              {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "completedAt",
                "type": "uint256"
              }
            ],
            "internalType": "struct JobMarketplace.Job[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_employer",
            "type": "address"
          }
        ],
        "name": "getEmployerJobs",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "address payable",
                "name": "employer",
                "type": "address"
              },
              {
                "internalType": "address payable",
                "name": "freelancer",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "title",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "payment",
                "type": "uint256"
              },
              {
                "internalType": "enum JobMarketplace.JobStatus",
                "name": "status",
                "type": "uint8"
              },
              {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "completedAt",
                "type": "uint256"
              }
            ],
            "internalType": "struct JobMarketplace.Job[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_freelancer",
            "type": "address"
          }
        ],
        "name": "getFreelancerJobs",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "address payable",
                "name": "employer",
                "type": "address"
              },
              {
                "internalType": "address payable",
                "name": "freelancer",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "title",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "payment",
                "type": "uint256"
              },
              {
                "internalType": "enum JobMarketplace.JobStatus",
                "name": "status",
                "type": "uint8"
              },
              {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "completedAt",
                "type": "uint256"
              }
            ],
            "internalType": "struct JobMarketplace.Job[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_jobId",
            "type": "uint256"
          }
        ],
        "name": "getJob",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "address payable",
                "name": "employer",
                "type": "address"
              },
              {
                "internalType": "address payable",
                "name": "freelancer",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "title",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "payment",
                "type": "uint256"
              },
              {
                "internalType": "enum JobMarketplace.JobStatus",
                "name": "status",
                "type": "uint8"
              },
              {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "completedAt",
                "type": "uint256"
              }
            ],
            "internalType": "struct JobMarketplace.Job",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "jobs",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "employer",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "freelancer",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "payment",
            "type": "uint256"
          },
          {
            "internalType": "enum JobMarketplace.JobStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "completedAt",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "platformFeePercentage",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_jobId",
            "type": "uint256"
          }
        ],
        "name": "raiseDispute",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_jobId",
            "type": "uint256"
          }
        ],
        "name": "releasePayment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_jobId",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "_winner",
            "type": "address"
          }
        ],
        "name": "resolveDispute",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_jobId",
            "type": "uint256"
          }
        ],
        "name": "takeJob",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "withdrawPlatformFees",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
];

