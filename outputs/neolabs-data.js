window.NEOLABS_DATA = Object.freeze({
  "version": "2026-07-20",
  "schema": {
    "analysisAxes": {
      "readiness": {
        "label": "Market readiness",
        "low": "None / NA",
        "high": "High",
        "hoverText": "How far the lab has progressed from research toward a usable product or service."
      },
      "capability": {
        "label": "Capability",
        "low": "Low",
        "high": "High",
        "hoverText": "The breadth and depth of intelligence the lab is targeting."
      },
      "dataEfficiency": {
        "label": "Data efficiency",
        "low": "Low",
        "high": "High",
        "hoverText": "How efficiently the approach turns training data into useful capability."
      },
      "computeEfficiency": {
        "label": "Compute efficiency",
        "low": "Low",
        "high": "High",
        "hoverText": "How much capability the approach delivers for a given amount of training or inference compute."
      },
      "adaptivity": {
        "label": "Adaptivity",
        "low": "Low",
        "high": "High",
        "hoverText": "How well the system can learn, update, or adjust to new tasks, environments, or feedback."
      },
      "controllability": {
        "label": "Controllability",
        "low": "Low",
        "high": "High",
        "hoverText": "How easily people can interpret and steer system behavior."
      }
    }
  },
  "labs": [
    {
      "id": "thinking",
      "name": "Thinking Machines Lab",
      "shortName": "Thinking Machines",
      "code": "TM",
      "formation": {
        "year": 2025,
        "insightId": "thinking.formation"
      },
      "fundingHistory": [
        {
          "id": "thinking-2025-seed",
          "date": "2025-07-15",
          "round": "seed",
          "amountRaisedUsd": 2000000000,
          "valuationUsd": 12000000000,
          "valuationType": "reported",
          "status": "closed",
          "insightId": "thinking.funding.2025-seed"
        }
      ],
      "disclosureConfidence": {
        "score": 3,
        "label": "high",
        "rationale": "Public product, leadership, financing and technical positioning are well documented.",
        "insightId": "thinking.disclosure"
      },
      "scores": {
        "readiness": {
          "score": 2,
          "rationale": "Tinker fine-tuning API is live; there is no frontier consumer product yet."
        },
        "capability": {
          "score": 3,
          "rationale": "Frontier-lab ambitions and multimodal model work support a high target-capability score."
        },
        "dataEfficiency": {
          "score": 2,
          "rationale": "Customization leverages existing models, but the underlying training regime still needs substantial data."
        },
        "computeEfficiency": {
          "score": 2,
          "rationale": "Fine-tuning can be more efficient than pretraining for many uses; a broad efficiency lead is not demonstrated."
        },
        "adaptivity": {
          "score": 3,
          "rationale": "Per-user customization and weight adaptation are central to the product thesis."
        },
        "controllability": {
          "score": 3,
          "rationale": "Determinism, reproducibility, and steerability are explicit research and product focuses."
        }
      },
      "note": "Builds frontier, customizable multimodal AI for human collaboration, pairing strong models with tools that let people adapt model weights and shape system behavior.",
      "keywords": [
        "customizable models"
      ],
      "noteInsightId": "thinking.thesis",
      "keyPeople": [
        {
          "name": "Mira Murati",
          "role": "CEO & Co-founder",
          "pastExperiences": [
            "Former CTO of OpenAI",
            "Led product and research work spanning ChatGPT, DALL·E and frontier multimodal systems"
          ]
        },
        {
          "name": "Barret Zoph",
          "role": "CTO & Co-founder",
          "pastExperiences": [
            "Former VP of Research (Post-Training) at OpenAI",
            "Former Google Brain researcher known for neural architecture search"
          ]
        },
        {
          "name": "John Schulman",
          "role": "Chief Scientist & Co-founder",
          "pastExperiences": [
            "Co-founded OpenAI and led reinforcement-learning research including PPO",
            "Former researcher at Anthropic"
          ]
        }
      ],
      "website": "https://thinkingmachines.ai/"
    },
    {
      "id": "ssi",
      "name": "SSI (Safe Superintelligence)",
      "shortName": "SSI",
      "code": "SSI",
      "formation": {
        "year": 2024,
        "insightId": "ssi.formation"
      },
      "fundingHistory": [
        {
          "id": "ssi-2024-seed",
          "date": "2024-09-04",
          "round": "seed",
          "amountRaisedUsd": 1000000000,
          "valuationUsd": 5000000000,
          "valuationType": "reported",
          "status": "closed",
          "insightId": "ssi.funding.2024-seed"
        },
        {
          "id": "ssi-2025-round",
          "date": "2025-04-12",
          "round": "private",
          "amountRaisedUsd": 2000000000,
          "valuationUsd": 32000000000,
          "valuationType": "reported",
          "status": "closed",
          "insightId": "ssi.funding.2025-round"
        }
      ],
      "disclosureConfidence": {
        "score": 1,
        "label": "limited",
        "rationale": "Mission and financing are public, but technical architecture, milestones and operations remain deliberately sparse.",
        "insightId": "ssi.disclosure"
      },
      "scores": {
        "readiness": {
          "score": 0,
          "rationale": "The lab deliberately has no product until its end goal is achieved."
        },
        "capability": {
          "score": 3,
          "rationale": "Superintelligence is the stated objective, with no lesser capability target disclosed."
        },
        "dataEfficiency": {
          "score": 1,
          "rationale": "The method is undisclosed; public reporting suggests divergence from pure scaling, but this is unverifiable."
        },
        "computeEfficiency": {
          "score": 1,
          "rationale": "The lab is associated with frontier-scale compute needs and offers no public efficiency evidence."
        },
        "adaptivity": {
          "score": 0,
          "rationale": "The method is undisclosed and no adaptive system is publicly demonstrated."
        },
        "controllability": {
          "score": 3,
          "rationale": "Safety is the founding premise and explicit goal, although the technical method is not public."
        }
      },
      "note": "A straight-shot lab whose sole roadmap is safe superintelligence, treating capability and safety as coupled technical problems insulated from product cycles.",
      "keywords": [
        "safe superintelligence"
      ],
      "noteInsightId": "ssi.thesis",
      "keyPeople": [
        {
          "name": "Ilya Sutskever",
          "role": "CEO & Co-founder",
          "pastExperiences": [
            "Co-founded OpenAI and served as Chief Scientist",
            "Former Google Brain researcher and major contributor to modern deep learning"
          ]
        },
        {
          "name": "Daniel Levy",
          "role": "Co-founder",
          "pastExperiences": [
            "Former OpenAI researcher",
            "Worked on optimization and training for frontier-scale models"
          ]
        }
      ],
      "website": "https://ssi.inc/"
    },
    {
      "id": "ineffable",
      "name": "Ineffable Intelligence",
      "shortName": "Ineffable",
      "code": "INE",
      "formation": {
        "year": 2025,
        "insightId": "ineffable.formation"
      },
      "fundingHistory": [
        {
          "id": "ineffable-2026-seed",
          "date": "2026-04-27",
          "round": "seed",
          "amountRaisedUsd": 1100000000,
          "valuationUsd": 5100000000,
          "valuationType": "reported",
          "status": "closed",
          "insightId": "ineffable.funding.2026-seed"
        }
      ],
      "disclosureConfidence": {
        "score": 1,
        "label": "limited",
        "rationale": "The learning thesis and financing are public, while implementation details and technical artifacts remain limited.",
        "insightId": "ineffable.disclosure"
      },
      "scores": {
        "readiness": {
          "score": 0,
          "rationale": "Pre-product; the lab is building reinforcement-learning infrastructure with Nvidia."
        },
        "capability": {
          "score": 3,
          "rationale": "The stated goal is a superlearner that discovers knowledge beyond human data."
        },
        "dataEfficiency": {
          "score": 3,
          "rationale": "It aims to use little or no human-data pretraining, trading it for experience generated through self-play."
        },
        "computeEfficiency": {
          "score": 1,
          "rationale": "Online act-observe-update loops are compute- and interconnect-intensive."
        },
        "adaptivity": {
          "score": 3,
          "rationale": "Continual learning from experience is the core thesis."
        },
        "controllability": {
          "score": 1,
          "rationale": "Reward specification and reward hacking remain unresolved at the proposed capability level."
        }
      },
      "note": "Pursues a continually learning “superlearner” that discovers knowledge from experience through large-scale reinforcement learning rather than relying on human-generated data.",
      "keywords": [
        "reinforcement learning"
      ],
      "noteInsightId": "ineffable.thesis",
      "keyPeople": [
        {
          "name": "David Silver",
          "role": "Founder & CEO",
          "pastExperiences": [
            "Led AlphaGo, AlphaZero and reinforcement-learning research at Google DeepMind",
            "Professor at University College London"
          ]
        }
      ],
      "website": "https://www.ineffable.ai/"
    },
    {
      "id": "recursive",
      "name": "Recursive Superintelligence",
      "shortName": "RSI",
      "code": "RSI",
      "formation": {
        "year": 2025,
        "insightId": "recursive.formation"
      },
      "fundingHistory": [
        {
          "id": "recursive-2026-round",
          "date": "2026-05-13",
          "round": "private",
          "amountRaisedUsd": 650000000,
          "valuationUsd": 4650000000,
          "valuationType": "post-money",
          "status": "closed",
          "insightId": "recursive.funding.2026-round"
        }
      ],
      "disclosureConfidence": {
        "score": 2,
        "label": "moderate",
        "rationale": "Team, financing and high-level research direction are public; detailed methods and evidence remain early.",
        "insightId": "recursive.disclosure"
      },
      "scores": {
        "readiness": {
          "score": 0,
          "rationale": "No flagship output is disclosed; the direction is automated self-improvement of AI pipelines."
        },
        "capability": {
          "score": 3,
          "rationale": "The thesis is to automate ideation, implementation, and validation so AI can improve itself."
        },
        "dataEfficiency": {
          "score": 2,
          "rationale": "Self-generated tasks and evolutionary populations reduce reliance on curated human data."
        },
        "computeEfficiency": {
          "score": 1,
          "rationale": "Open-ended search over populations is compute-voracious."
        },
        "adaptivity": {
          "score": 3,
          "rationale": "Self-modification and recursive improvement are the product thesis."
        },
        "controllability": {
          "score": 0,
          "rationale": "Recursive self-improvement is the canonical hard-to-control regime, with the loop designed to exclude humans."
        }
      },
      "note": "Aims to automate AI research through open-ended algorithms and recursive self-improvement, then apply the same compounding discovery loop across scientific fields.",
      "keywords": [
        "recursive self-improvement"
      ],
      "noteInsightId": "recursive.thesis",
      "keyPeople": [
        {
          "name": "Richard Socher",
          "role": "CEO & Co-founder",
          "pastExperiences": [
            "Former Chief Scientist at Salesforce after founding MetaMind",
            "Founder of You.com and former Stanford NLP researcher"
          ]
        },
        {
          "name": "Tim Rocktäschel",
          "role": "Co-founder",
          "pastExperiences": [
            "Formerly led open-endedness and self-improvement research at Google DeepMind",
            "Professor at University College London"
          ]
        },
        {
          "name": "Jeff Clune",
          "role": "Co-founder",
          "pastExperiences": [
            "Former research leader at OpenAI and Uber AI Labs",
            "Professor known for open-ended algorithms and AI-generating algorithms"
          ]
        },
        {
          "name": "Tim Shi",
          "role": "Co-founder",
          "pastExperiences": [
            "Co-founded Cresta",
            "Early team member at OpenAI"
          ]
        }
      ],
      "website": "https://www.recursive.com/"
    },
    {
      "id": "sakana",
      "name": "Sakana AI",
      "shortName": "Sakana",
      "code": "SAK",
      "formation": {
        "year": 2023,
        "insightId": "sakana.formation"
      },
      "fundingHistory": [
        {
          "id": "sakana-2024-series-a",
          "date": "2024-09-04",
          "round": "series-a",
          "amountRaisedUsd": 200000000,
          "valuationUsd": 1100000000,
          "valuationType": "reported",
          "status": "closed",
          "insightId": "sakana.funding.2024-series-a"
        },
        {
          "id": "sakana-2025-series-b",
          "date": "2025-11-17",
          "round": "series-b",
          "amountRaisedUsd": 200000000,
          "valuationUsd": 2700000000,
          "valuationType": "post-money",
          "status": "closed",
          "insightId": "sakana.funding.2025-series-b"
        }
      ],
      "disclosureConfidence": {
        "score": 3,
        "label": "high",
        "rationale": "Extensive papers, product deployments, company updates and financing details are public.",
        "insightId": "sakana.disclosure"
      },
      "scores": {
        "readiness": {
          "score": 2,
          "rationale": "Enterprise work and the AI Scientist are shipping in Japan."
        },
        "capability": {
          "score": 2,
          "rationale": "The lab pursues novel intelligence without chasing frontier scale head-on."
        },
        "dataEfficiency": {
          "score": 3,
          "rationale": "Model merging and recombination reuse existing models rather than pretraining from scratch."
        },
        "computeEfficiency": {
          "score": 3,
          "rationale": "Efficiency is the core thesis, including smaller and recombined systems."
        },
        "adaptivity": {
          "score": 3,
          "rationale": "Evolution is inherently adaptive, though adaptation is generally per-deployment."
        },
        "controllability": {
          "score": 1,
          "rationale": "Evolved and merged systems can be difficult to audit."
        }
      },
      "note": "Explores nature-inspired, evolutionary, collective and automated-research approaches to capable AI, emphasizing efficiency and architectural diversity.",
      "keywords": [
        "evolutionary AI"
      ],
      "noteInsightId": "sakana.thesis",
      "keyPeople": [
        {
          "name": "David Ha",
          "role": "CEO & Co-founder",
          "pastExperiences": [
            "Former research scientist at Google Brain",
            "Former Head of Research at Stability AI"
          ]
        },
        {
          "name": "Llion Jones",
          "role": "CTO & Co-founder",
          "pastExperiences": [
            "Former Google researcher",
            "Co-author of the Transformer paper “Attention Is All You Need”"
          ]
        },
        {
          "name": "Ren Ito",
          "role": "Chairman & Co-founder",
          "pastExperiences": [
            "Technology executive and investor",
            "Former Mercari executive"
          ]
        }
      ],
      "website": "https://sakana.ai/"
    },
    {
      "id": "liquid",
      "name": "Liquid AI",
      "shortName": "Liquid",
      "code": "LIQ",
      "formation": {
        "year": 2023,
        "insightId": "liquid.formation"
      },
      "fundingHistory": [
        {
          "id": "liquid-2023-seed",
          "date": "2023-12-06",
          "round": "seed",
          "amountRaisedUsd": 37500000,
          "valuationUsd": null,
          "valuationType": "undisclosed",
          "status": "closed",
          "insightId": "liquid.funding.2023-seed"
        },
        {
          "id": "liquid-2024-series-a",
          "date": "2024-12-13",
          "round": "series-a",
          "amountRaisedUsd": 250000000,
          "valuationUsd": 2300000000,
          "valuationType": "reported",
          "status": "closed",
          "insightId": "liquid.funding.2024-series-a"
        }
      ],
      "disclosureConfidence": {
        "score": 3,
        "label": "high",
        "rationale": "Models, research, products, founders and major funding rounds are documented publicly.",
        "insightId": "liquid.disclosure"
      },
      "scores": {
        "readiness": {
          "score": 3,
          "rationale": "LFMs and an edge-deployment platform are shipping."
        },
        "capability": {
          "score": 2,
          "rationale": "Best-in-class small models are demonstrated, but this is not primarily an AGI-scale bet."
        },
        "dataEfficiency": {
          "score": 3,
          "rationale": "Smaller models need less data and compute, but they remain pretrained systems."
        },
        "computeEfficiency": {
          "score": 3,
          "rationale": "On-device, low-power inference is the central selling point."
        },
        "adaptivity": {
          "score": 3,
          "rationale": "Continuous-time dynamics adapt at inference by construction."
        },
        "controllability": {
          "score": 3,
          "rationale": "Dynamical-systems formalism is more analyzable, with the claim partially validated."
        }
      },
      "note": "Builds efficiency-first foundation models from first principles, optimized for capability, low compute and memory use, on-device deployment, interpretability and privacy.",
      "keywords": [
        "liquid neural net"
      ],
      "noteInsightId": "liquid.thesis",
      "keyPeople": [
        {
          "name": "Ramin Hasani",
          "role": "CEO & Co-founder",
          "pastExperiences": [
            "Former Principal AI and Machine Learning Scientist at Vanguard",
            "MIT CSAIL scientist and pioneer of liquid neural netldks"
          ]
        },
        {
          "name": "Mathias Lechner",
          "role": "CTO & Co-founder",
          "pastExperiences": [
            "MIT CSAIL research affiliate",
            "Co-developed liquid neural networks at TU Wien and MIT"
          ]
        },
        {
          "name": "Alexander Amini",
          "role": "Chief Scientific Officer & Co-founder",
          "pastExperiences": [
            "MIT CSAIL researcher and educator",
            "Research in robust autonomous and generative systems"
          ]
        },
        {
          "name": "Daniela Rus",
          "role": "Co-founder",
          "pastExperiences": [
            "Director of MIT CSAIL",
            "Robotics and autonomous-systems pioneer"
          ]
        }
      ],
      "website": "https://www.liquid.ai/"
    },
    {
      "id": "ndea",
      "name": "Ndea",
      "shortName": "Ndea",
      "code": "NDE",
      "formation": {
        "year": 2024,
        "insightId": "ndea.formation"
      },
      "fundingHistory": [
        {
          "id": "ndea-2025-launch",
          "date": "2025-01-15",
          "round": "undisclosed",
          "amountRaisedUsd": null,
          "valuationUsd": null,
          "valuationType": "undisclosed",
          "status": "not-publicly-disclosed",
          "insightId": "ndea.funding.2025-launch"
        }
      ],
      "disclosureConfidence": {
        "score": 3,
        "label": "high",
        "rationale": "The program-synthesis thesis and founders are explicit, although financing remains undisclosed.",
        "insightId": "ndea.disclosure"
      },
      "scores": {
        "readiness": {
          "score": 0,
          "rationale": "Research lab with no product disclosed."
        },
        "capability": {
          "score": 3,
          "rationale": "AGI is framed as efficient skill acquisition, with science automation as a major ambition."
        },
        "dataEfficiency": {
          "score": 3,
          "rationale": "Few-shot abstraction and the ARC lineage are the philosophical thesis."
        },
        "computeEfficiency": {
          "score": 3,
          "rationale": "Search is expensive, but synthesized programs are cheap to run once found."
        },
        "adaptivity": {
          "score": 3,
          "rationale": "Test-time adaptation to novel tasks is the goal."
        },
        "controllability": {
          "score": 3,
          "rationale": "Synthesized programs are intended to be human-readable and verifiable."
        }
      },
      "note": "Combines deep learning with program synthesis to build systems that invent abstractions and adapt to genuinely novel problems, with ARC-AGI as a central measure of progress.",
      "keywords": [
        "program synthesis"
      ],
      "noteInsightId": "ndea.thesis",
      "keyPeople": [
        {
          "name": "François Chollet",
          "role": "Co-founder",
          "pastExperiences": [
            "Created Keras and ARC-AGI",
            "Former Google engineer and author of “Deep Learning with Python”"
          ]
        },
        {
          "name": "Mike Knoop",
          "role": "Co-founder",
          "pastExperiences": [
            "Co-founded Zapier and led product and engineering as President",
            "Co-founded the ARC Prize Foundation"
          ]
        }
      ],
      "website": "https://ndea.com/"
    },
    {
      "id": "ami",
      "name": "AMI Labs",
      "shortName": "AMI",
      "code": "AMI",
      "formation": {
        "year": 2025,
        "insightId": "ami.formation"
      },
      "fundingHistory": [
        {
          "id": "ami-2026-seed",
          "date": "2026-03-10",
          "round": "seed",
          "amountRaisedUsd": 1030000000,
          "valuationUsd": 3500000000,
          "valuationType": "pre-money",
          "status": "closed",
          "insightId": "ami.funding.2026-seed"
        }
      ],
      "disclosureConfidence": {
        "score": 2,
        "label": "moderate",
        "rationale": "Mission, founders and financing are public; the lab is young and detailed technical execution remains limited.",
        "insightId": "ami.disclosure"
      },
      "scores": {
        "readiness": {
          "score": 0,
          "rationale": "Explicitly a research organization; no saleable product is expected on the near-term horizon."
        },
        "capability": {
          "score": 3,
          "rationale": "The thesis targets human-level intelligence through persistent memory, reasoning, and planning."
        },
        "dataEfficiency": {
          "score": 3,
          "rationale": "JEPA-style representations avoid pixel-level prediction and emphasize abstract learning from observation."
        },
        "computeEfficiency": {
          "score": 3,
          "rationale": "Modular, objective-driven world models are pitched as more efficient than generative alternatives."
        },
        "adaptivity": {
          "score": 3,
          "rationale": "Persistent memory and domain-specific world models are designed to update from experience."
        },
        "controllability": {
          "score": 3,
          "rationale": "Modular objectives and learned dynamics are pitched as controllable by construction, though unproven."
        }
      },
      "note": "Bets that action-conditioned world models—not language prediction alone—are the path to reasoning, planning, persistent memory and controllable real-world intelligence.",
      "keywords": [
        "world models"
      ],
      "noteInsightId": "ami.thesis",
      "keyPeople": [
        {
          "name": "Yann LeCun",
          "role": "Executive Chairman & Co-founder",
          "pastExperiences": [
            "Former Chief AI Scientist at Meta",
            "NYU professor, Bell Labs alumnus and 2018 Turing Award laureate"
          ]
        },
        {
          "name": "Alex LeBrun",
          "role": "CEO",
          "pastExperiences": [
            "Co-founded and led healthcare AI company Nabla",
            "Founded Wit.ai, acquired by Facebook"
          ]
        }
      ],
      "website": "https://amilabs.xyz/"
    },
    {
      "id": "worldlabs",
      "name": "World Labs",
      "shortName": "World Labs",
      "code": "WL",
      "formation": {
        "year": 2024,
        "insightId": "worldlabs.formation"
      },
      "fundingHistory": [
        {
          "id": "worldlabs-2024-early",
          "date": "2024-09-13",
          "round": "early-stage-aggregate",
          "amountRaisedUsd": 230000000,
          "valuationUsd": 1000000000,
          "valuationType": "reported-floor",
          "status": "closed",
          "insightId": "worldlabs.funding.2024-early"
        },
        {
          "id": "worldlabs-2026-round",
          "date": "2026-02-18",
          "round": "private",
          "amountRaisedUsd": 1000000000,
          "valuationUsd": 5000000000,
          "valuationType": "reported-in-talks",
          "status": "closed-valuation-undisclosed",
          "insightId": "worldlabs.funding.2026-round"
        }
      ],
      "disclosureConfidence": {
        "score": 3,
        "label": "high",
        "rationale": "Products, research framing, founders and financing are substantially documented.",
        "insightId": "worldlabs.disclosure"
      },
      "scores": {
        "readiness": {
          "score": 2,
          "rationale": "Marble has launched as a product."
        },
        "capability": {
          "score": 3,
          "rationale": "Spatial intelligence is framed as an AGI pillar, not the whole capability stack."
        },
        "dataEfficiency": {
          "score": 1,
          "rationale": "3D and video workloads are data-hungry."
        },
        "computeEfficiency": {
          "score": 2,
          "rationale": "Generative 3D workloads remain heavy, despite ongoing efficiency work."
        },
        "adaptivity": {
          "score": 2,
          "rationale": "Persistent, editable worlds help, but adaptive agents are not yet demonstrated."
        },
        "controllability": {
          "score": 3,
          "rationale": "Explicit 3D representations are inspectable and editable."
        }
      },
      "note": "Builds spatially intelligent world models that perceive, generate, reason about and interact with 3D worlds; Marble turns prompts and media into persistent 3D environments.",
      "keywords": [
        "spatial intelligence"
      ],
      "noteInsightId": "worldlabs.thesis",
      "keyPeople": [
        {
          "name": "Fei-Fei Li",
          "role": "CEO & Co-founder",
          "pastExperiences": [
            "Created ImageNet and co-directs Stanford HAI",
            "Former Chief Scientist of AI/ML at Google Cloud"
          ]
        },
        {
          "name": "Justin Johnson",
          "role": "Co-founder",
          "pastExperiences": [
            "Former research scientist at Meta AI",
            "Computer-vision and graphics researcher and Stanford professor"
          ]
        },
        {
          "name": "Christoph Lassner",
          "role": "Co-founder",
          "pastExperiences": [
            "Former researcher at Meta Reality Labs and Epic Games",
            "Specialist in neural rendering and 3D vision"
          ]
        },
        {
          "name": "Ben Mildenhall",
          "role": "Co-founder",
          "pastExperiences": [
            "Former Google Research scientist",
            "Co-inventor of Neural Radiance Fields (NeRF)"
          ]
        }
      ],
      "website": "https://www.worldlabs.ai/"
    },
    {
      "id": "inception",
      "name": "Inception Labs",
      "shortName": "Inception",
      "code": "INC",
      "formation": {
        "year": 2024,
        "insightId": "inception.formation"
      },
      "fundingHistory": [
        {
          "id": "inception-2025-seed",
          "date": "2025-11-06",
          "round": "seed",
          "amountRaisedUsd": 50000000,
          "valuationUsd": null,
          "valuationType": "undisclosed",
          "status": "closed",
          "insightId": "inception.funding.2025-seed"
        }
      ],
      "disclosureConfidence": {
        "score": 3,
        "label": "high",
        "rationale": "Commercial models, technical differentiation, founders and financing are publicly documented.",
        "insightId": "inception.disclosure"
      },
      "scores": {
        "readiness": {
          "score": 2,
          "rationale": "Mercury is commercially available through an API."
        },
        "capability": {
          "score": 2,
          "rationale": "It is a better generation paradigm rather than a complete AGI thesis."
        },
        "dataEfficiency": {
          "score": 1,
          "rationale": "Diffusion decoding changes the generation process, not the comparable data appetite of the model."
        },
        "computeEfficiency": {
          "score": 3,
          "rationale": "Parallel decoding is intended to deliver major throughput gains."
        },
        "adaptivity": {
          "score": 2,
          "rationale": "Native editing and infilling support adjustment during generation."
        },
        "controllability": {
          "score": 3,
          "rationale": "Diffusion permits constrained and structured generation."
        }
      },
      "note": "Replaces sequential autoregressive decoding with diffusion-based language generation for parallel refinement, lower latency and cost, and editable production AI.",
      "keywords": [
        "diffusion language models"
      ],
      "noteInsightId": "inception.thesis",
      "keyPeople": [
        {
          "name": "Stefano Ermon",
          "role": "CEO & Co-founder",
          "pastExperiences": [
            "Stanford professor and pioneer of score-based generative modeling",
            "Research leader in diffusion models and probabilistic AI"
          ]
        },
        {
          "name": "Aditya Grover",
          "role": "Co-founder",
          "pastExperiences": [
            "UCLA professor and former Stanford researcher",
            "Co-inventor of Decision Transformers and researcher in generative modeling"
          ]
        },
        {
          "name": "Volodymyr Kuleshov",
          "role": "Co-founder",
          "pastExperiences": [
            "Cornell professor",
            "Researcher in generative modeling, trustworthy machine learning and AI for science"
          ]
        }
      ],
      "website": "https://www.inceptionlabs.ai/"
    },
    {
      "id": "openai",
      "name": "OpenAI",
      "shortName": "OpenAI",
      "code": "OAI",
      "formation": {
        "year": 2015,
        "insightId": "openai.formation"
      },
      "fundingHistory": [
        {
          "id": "openai-2023-secondary",
          "date": "2023-04-28",
          "round": "secondary-sale",
          "amountRaisedUsd": 300000000,
          "valuationUsd": 29000000000,
          "valuationType": "reported-range-high",
          "status": "closed",
          "insightId": "openai.funding.2023-secondary"
        },
        {
          "id": "openai-2024-round",
          "date": "2024-10-02",
          "round": "private",
          "amountRaisedUsd": 6600000000,
          "valuationUsd": 157000000000,
          "valuationType": "reported",
          "status": "closed",
          "insightId": "openai.funding.2024-round"
        },
        {
          "id": "openai-2025-round",
          "date": "2025-04-01",
          "round": "private",
          "amountRaisedUsd": 40000000000,
          "valuationUsd": 300000000000,
          "valuationType": "reported",
          "status": "closed",
          "insightId": "openai.funding.2025-round"
        },
        {
          "id": "openai-2026-round",
          "date": "2026-03-24",
          "round": "private",
          "amountRaisedUsd": 10000000000,
          "valuationUsd": 850000000000,
          "valuationType": "reported",
          "status": "in-progress-report",
          "insightId": "openai.funding.2026-round"
        }
      ],
      "disclosureConfidence": {
        "score": 3,
        "label": "high",
        "rationale": "Products, research, financing and corporate structure are extensively documented.",
        "insightId": "openai.disclosure"
      },
      "scores": {
        "readiness": {
          "score": 3,
          "rationale": "OpenAI has the largest deployed footprint and a mature API and product stack."
        },
        "capability": {
          "score": 3,
          "rationale": "The lab has an explicit AGI mission and operates at the frontier."
        },
        "dataEfficiency": {
          "score": 1,
          "rationale": "Internet-scale pretraining remains central."
        },
        "computeEfficiency": {
          "score": 1,
          "rationale": "The approach is primarily brute-force scaling, even as inference costs fall."
        },
        "adaptivity": {
          "score": 2,
          "rationale": "In-context learning and fine-tuning help, but there is no true continual learning."
        },
        "controllability": {
          "score": 2,
          "rationale": "RLHF and model-spec work improve steering, but systems remain jailbreakable and opaque."
        }
      },
      "note": "Reference frontier lab behind GPT and ChatGPT, general-purpose models and deployment infrastructure across research, products and developer platforms.",
      "keywords": [
        "transformer-scaling"
      ],
      "noteInsightId": "openai.thesis",
      "keyPeople": [
        {
          "name": "Sam Altman",
          "role": "CEO",
          "pastExperiences": [
            "Co-founder and former president of Y Combinator",
            "Investor and technology entrepreneur"
          ]
        },
        {
          "name": "Greg Brockman",
          "role": "Co-founder",
          "pastExperiences": [
            "Former president and chairman of OpenAI",
            "Former CTO of Stripe"
          ]
        }
      ],
      "website": "https://openai.com/"
    },
    {
      "id": "anthropic",
      "name": "Anthropic",
      "shortName": "Anthropic",
      "code": "ANT",
      "formation": {
        "year": 2021,
        "insightId": "anthropic.formation"
      },
      "fundingHistory": [
        {
          "id": "anthropic-2023-series-c",
          "date": "2023-05-23",
          "round": "series-c",
          "amountRaisedUsd": 450000000,
          "valuationUsd": 4100000000,
          "valuationType": "reported",
          "status": "closed",
          "insightId": "anthropic.funding.2023-series-c"
        },
        {
          "id": "anthropic-2024-series-d",
          "date": "2024-03-27",
          "round": "series-d",
          "amountRaisedUsd": 2750000000,
          "valuationUsd": 18400000000,
          "valuationType": "reported",
          "status": "closed",
          "insightId": "anthropic.funding.2024-series-d"
        },
        {
          "id": "anthropic-2025-series-e",
          "date": "2025-03-03",
          "round": "series-e",
          "amountRaisedUsd": 3500000000,
          "valuationUsd": 61500000000,
          "valuationType": "post-money",
          "status": "closed",
          "insightId": "anthropic.funding.2025-series-e"
        },
        {
          "id": "anthropic-2025-series-f",
          "date": "2025-09-03",
          "round": "series-f",
          "amountRaisedUsd": 13000000000,
          "valuationUsd": 183000000000,
          "valuationType": "post-money",
          "status": "closed",
          "insightId": "anthropic.funding.2025-series-f"
        },
        {
          "id": "anthropic-2026-series-g",
          "date": "2026-02-12",
          "round": "series-g",
          "amountRaisedUsd": 30000000000,
          "valuationUsd": 380000000000,
          "valuationType": "post-money",
          "status": "closed",
          "insightId": "anthropic.funding.2026-series-g"
        },
        {
          "id": "anthropic-2026-series-h",
          "date": "2026-05-28",
          "round": "series-h",
          "amountRaisedUsd": 65000000000,
          "valuationUsd": 965000000000,
          "valuationType": "post-money",
          "status": "closed",
          "insightId": "anthropic.funding.2026-series-h"
        }
      ],
      "disclosureConfidence": {
        "score": 3,
        "label": "high",
        "rationale": "Model releases, research, partnerships and financing are extensively documented.",
        "insightId": "anthropic.disclosure"
      },
      "scores": {
        "readiness": {
          "score": 3,
          "rationale": "Frontier models, enterprise offerings, and agentic products are commercially available."
        },
        "capability": {
          "score": 3,
          "rationale": "Transformative AI is an explicit objective and frontier models are deployed."
        },
        "dataEfficiency": {
          "score": 1,
          "rationale": "The lab remains in the large-scale pretraining regime."
        },
        "computeEfficiency": {
          "score": 2,
          "rationale": "Scaling and efficiency work are meaningful, but frontier capability remains resource-intensive."
        },
        "adaptivity": {
          "score": 2,
          "rationale": "The same core limits as OpenAI remain: context and tools adapt, but not true continual learning."
        },
        "controllability": {
          "score": 3,
          "rationale": "Constitutional AI and mechanistic interpretability make control a core research bet, though it remains imperfect."
        }
      },
      "note": "Reference frontier lab focused on reliable, interpretable foundation models, with Claude and related systems serving research, coding and enterprise use cases.",
      "keywords": [
        "safety-centric transformer-scaling"
      ],
      "noteInsightId": "anthropic.thesis",
      "keyPeople": [
        {
          "name": "Dario Amodei",
          "role": "CEO & Co-founder",
          "pastExperiences": [
            "Former vice president of research at OpenAI",
            "Led research on large-scale language models"
          ]
        },
        {
          "name": "Daniela Amodei",
          "role": "President & Co-founder",
          "pastExperiences": [
            "Former vice president of safety and policy at OpenAI",
            "Leads operations and company strategy at Anthropic"
          ]
        }
      ],
      "website": "https://www.anthropic.com/"
    }
  ],
  "sources": {
    "thinking-official": {
      "title": "Thinking Machines Lab",
      "publisher": "Thinking Machines Lab",
      "url": "https://thinkingmachines.ai/",
      "publishedAt": null,
      "accessedAt": "2026-07-17",
      "type": "company"
    },
    "thinking-reuters-2025": {
      "title": "Thinking Machines valued at $12 billion in early-stage funding",
      "publisher": "Reuters",
      "url": "https://finance.yahoo.com/news/mira-muratis-ai-startup-thinking-170344492.html",
      "publishedAt": "2025-07-15",
      "accessedAt": "2026-07-17",
      "type": "news"
    },
    "ssi-official": {
      "title": "Safe Superintelligence Inc.",
      "publisher": "SSI",
      "url": "https://ssi.inc/",
      "publishedAt": "2024-06-19",
      "accessedAt": "2026-07-17",
      "type": "company"
    },
    "ssi-reuters-2024": {
      "title": "Safe Superintelligence raises $1 billion",
      "publisher": "Reuters",
      "url": "https://www.investing.com/news/stock-market-news/exclusiveopenai-cofounder-sutskevers-new-safetyfocused-ai-startup-ssi-raises-1-billion-3600613",
      "publishedAt": "2024-09-04",
      "accessedAt": "2026-07-17",
      "type": "news"
    },
    "ssi-techcrunch-2025": {
      "title": "Safe Superintelligence reportedly valued at $32B",
      "publisher": "TechCrunch",
      "url": "https://techcrunch.com/2025/04/12/openai-co-founder-ilya-sutskevers-safe-superintelligence-reportedly-valued-at-32b/",
      "publishedAt": "2025-04-12",
      "accessedAt": "2026-07-17",
      "type": "news"
    },
    "ineffable-official": {
      "title": "Ineffable Intelligence",
      "publisher": "Ineffable Intelligence",
      "url": "https://www.ineffable.ai/",
      "publishedAt": null,
      "accessedAt": "2026-07-17",
      "type": "company"
    },
    "ineffable-techcrunch-2026": {
      "title": "Ineffable raises $1.1B to build a superlearner",
      "publisher": "TechCrunch",
      "url": "https://techcrunch.com/2026/04/27/deepminds-david-silver-just-raised-1-1b-to-build-an-ai-that-learns-without-human-data/",
      "publishedAt": "2026-04-27",
      "accessedAt": "2026-07-17",
      "type": "news"
    },
    "recursive-official": {
      "title": "Recursive Superintelligence",
      "publisher": "Recursive Superintelligence",
      "url": "https://www.recursive.com/",
      "publishedAt": null,
      "accessedAt": "2026-07-17",
      "type": "company"
    },
    "recursive-caplight": {
      "title": "Recursive Superintelligence company profile",
      "publisher": "Caplight",
      "url": "https://www.caplight.com/company/recursive",
      "publishedAt": null,
      "accessedAt": "2026-07-17",
      "type": "company-database"
    },
    "recursive-axios-2026": {
      "title": "Recursive Superintelligence confirms $650M raise",
      "publisher": "Axios",
      "url": "https://www.axios.com/newsletters/axios-pro-rata-894ef9e3-9e1f-4cf1-9f7c-7c1e2f57c968",
      "publishedAt": "2026-05-14",
      "accessedAt": "2026-07-17",
      "type": "news"
    },
    "sakana-company": {
      "title": "Corporate Information",
      "publisher": "Sakana AI",
      "url": "https://sakana.ai/company-info/",
      "publishedAt": null,
      "accessedAt": "2026-07-17",
      "type": "company"
    },
    "sakana-series-a": {
      "title": "Announcing Our Series A",
      "publisher": "Sakana AI",
      "url": "https://sakana.ai/series-a/",
      "publishedAt": "2024-09-04",
      "accessedAt": "2026-07-17",
      "type": "company"
    },
    "sakana-jetro-2024": {
      "title": "Switzerland Newsletter 180",
      "publisher": "JETRO",
      "url": "https://www.jetro.go.jp/ext_images/switzerland/newsletter/Newsletter_2024/newsletter180.pdf",
      "publishedAt": "2024-09-01",
      "accessedAt": "2026-07-17",
      "type": "report"
    },
    "sakana-series-b": {
      "title": "Announcing Our Series B",
      "publisher": "Sakana AI",
      "url": "https://sakana.ai/series-b/",
      "publishedAt": "2025-11-17",
      "accessedAt": "2026-07-17",
      "type": "company"
    },
    "liquid-launch": {
      "title": "A New Generation of AI Models from First Principles",
      "publisher": "Liquid AI",
      "url": "https://www.liquid.ai/blog/new-generation-of-ai-models-from-first-principles",
      "publishedAt": "2023-12-06",
      "accessedAt": "2026-07-17",
      "type": "company"
    },
    "liquid-techcrunch-2023": {
      "title": "Liquid AI emerges with $37.5M",
      "publisher": "TechCrunch",
      "url": "https://techcrunch.com/2023/12/06/liquid-ai-a-new-mit-spinoff-wants-to-build-an-entirely-new-type-of-ai/",
      "publishedAt": "2023-12-06",
      "accessedAt": "2026-07-17",
      "type": "news"
    },
    "liquid-series-a": {
      "title": "We raised $250M",
      "publisher": "Liquid AI",
      "url": "https://www.liquid.ai/blog/we-raised-250m-to-scale-capable-and-efficient-general-purpose-ai",
      "publishedAt": "2024-12-13",
      "accessedAt": "2026-07-17",
      "type": "company"
    },
    "liquid-bloomberg-2024": {
      "title": "Liquid AI raising $250 million",
      "publisher": "Bloomberg",
      "url": "https://www.bloomberg.com/news/articles/2024-12-13/liquid-ai-raising-250-million-to-build-ai-inspired-by-worm-brains",
      "publishedAt": "2024-12-13",
      "accessedAt": "2026-07-17",
      "type": "news"
    },
    "ndea-about": {
      "title": "About Ndea",
      "publisher": "Ndea",
      "url": "https://ndea.com/about.html",
      "publishedAt": null,
      "accessedAt": "2026-07-17",
      "type": "company"
    },
    "ndea-techcrunch-2025": {
      "title": "François Chollet founds Ndea",
      "publisher": "TechCrunch",
      "url": "https://techcrunch.com/2025/01/15/ai-researcher-francois-chollet-founds-a-new-ai-lab-focused-on-agi/",
      "publishedAt": "2025-01-15",
      "accessedAt": "2026-07-17",
      "type": "news"
    },
    "ndea-yc": {
      "title": "Ndea company profile",
      "publisher": "Y Combinator",
      "url": "https://www.ycombinator.com/companies/ndea-com",
      "publishedAt": null,
      "accessedAt": "2026-07-17",
      "type": "company-database"
    },
    "ami-official": {
      "title": "AMI Labs",
      "publisher": "AMI Labs",
      "url": "https://amilabs.xyz/",
      "publishedAt": null,
      "accessedAt": "2026-07-17",
      "type": "company"
    },
    "ami-reuters-2026": {
      "title": "AMI raises $1.03 billion",
      "publisher": "Reuters",
      "url": "https://www.investing.com/news/stock-market-news/exmeta-ai-chief-yann-lecuns-ami-raises-103-billion-for-alternative-ai-approach-4551055",
      "publishedAt": "2026-03-10",
      "accessedAt": "2026-07-17",
      "type": "news"
    },
    "world-official": {
      "title": "World Labs",
      "publisher": "World Labs",
      "url": "https://www.worldlabs.ai/",
      "publishedAt": null,
      "accessedAt": "2026-07-17",
      "type": "company"
    },
    "world-techcrunch-2024": {
      "title": "World Labs comes out of stealth with $230M",
      "publisher": "TechCrunch",
      "url": "https://techcrunch.com/2024/09/13/fei-fei-lis-world-labs-comes-out-of-stealth-with-230m-in-funding/",
      "publishedAt": "2024-09-13",
      "accessedAt": "2026-07-17",
      "type": "news"
    },
    "world-funding-2026": {
      "title": "World Labs Announces New Funding",
      "publisher": "World Labs",
      "url": "https://www.worldlabs.ai/blog/funding-2026",
      "publishedAt": "2026-02-18",
      "accessedAt": "2026-07-17",
      "type": "company"
    },
    "world-reuters-2026": {
      "title": "World Labs raises $1 billion",
      "publisher": "Reuters",
      "url": "https://www.investing.com/news/stock-market-news/ai-pioneer-feifei-lis-world-labs-raises-1-billion-in-funding-4511890",
      "publishedAt": "2026-02-18",
      "accessedAt": "2026-07-17",
      "type": "news"
    },
    "inception-about": {
      "title": "About Inception",
      "publisher": "Inception",
      "url": "https://www.inceptionlabs.ai/about",
      "publishedAt": null,
      "accessedAt": "2026-07-17",
      "type": "company"
    },
    "inception-techcrunch-2025": {
      "title": "Inception raises $50 million",
      "publisher": "TechCrunch",
      "url": "https://techcrunch.com/2025/11/06/inception-raises-50-million-to-build-diffusion-models-for-code-and-text/",
      "publishedAt": "2025-11-06",
      "accessedAt": "2026-07-17",
      "type": "news"
    },
    "inception-cbinsights": {
      "title": "Inception Labs company profile",
      "publisher": "CB Insights",
      "url": "https://www.cbinsights.com/company/inception-labs",
      "publishedAt": null,
      "accessedAt": "2026-07-17",
      "type": "company-database"
    },
    "openai-official": {
      "title": "OpenAI",
      "publisher": "OpenAI",
      "url": "https://openai.com/",
      "publishedAt": null,
      "accessedAt": "2026-07-19",
      "type": "company"
    },
    "openai-2023-techcrunch": {
      "title": "OpenAI closes $300M share sale at $27B-$29B valuation",
      "publisher": "TechCrunch",
      "url": "https://techcrunch.com/2023/04/28/openai-funding-valuation-chatgpt/",
      "publishedAt": "2023-04-28",
      "accessedAt": "2026-07-19",
      "type": "news"
    },
    "openai-2024-reuters": {
      "title": "OpenAI raises $6.6B at $157B valuation",
      "publisher": "Reuters",
      "url": "https://www.investing.com/news/stock-market-news/from-nonprofit-roots-to-forprofit-ambitions-the-openai-saga-4314461",
      "publishedAt": "2024-10-02",
      "accessedAt": "2026-07-19",
      "type": "news"
    },
    "openai-2025-reuters": {
      "title": "OpenAI raises up to $40B at $300B valuation",
      "publisher": "Reuters",
      "url": "https://www.investing.com/news/stock-market-news/from-nonprofit-roots-to-forprofit-ambitions-the-openai-saga-4314461",
      "publishedAt": "2025-04-01",
      "accessedAt": "2026-07-19",
      "type": "news"
    },
    "openai-2026-reuters": {
      "title": "OpenAI set to raise $10B at $850B valuation",
      "publisher": "Reuters",
      "url": "https://www.sahmcapital.com/news/content/openai-set-to-raise-10-billion-from-mgx-coatue-and-thrive-capital-source-says-2026-03-24",
      "publishedAt": "2026-03-24",
      "accessedAt": "2026-07-19",
      "type": "news"
    },
    "anthropic-official": {
      "title": "Anthropic",
      "publisher": "Anthropic",
      "url": "https://www.anthropic.com/",
      "publishedAt": null,
      "accessedAt": "2026-07-19",
      "type": "company"
    },
    "anthropic-2023-information": {
      "title": "Anthropic raises $450M in Series C",
      "publisher": "The Information",
      "url": "https://www.theinformation.com/briefings/anthropic-raises-450-million-in-funding-to-fuel-ai-work",
      "publishedAt": "2023-05-23",
      "accessedAt": "2026-07-19",
      "type": "news"
    },
    "anthropic-2024-stockanalysis": {
      "title": "Anthropic valuation and funding history",
      "publisher": "Stock Analysis",
      "url": "https://stockanalysis.com/private/anthropic/valuation/",
      "publishedAt": null,
      "accessedAt": "2026-07-19",
      "type": "company-database"
    },
    "anthropic-2025-series-e": {
      "title": "Anthropic raises Series E at $61.5B post-money valuation",
      "publisher": "Anthropic",
      "url": "https://www.anthropic.com/news/anthropic-raises-series-e-at-usd61-5b-post-money-valuation",
      "publishedAt": "2025-03-03",
      "accessedAt": "2026-07-19",
      "type": "company"
    },
    "anthropic-2025-series-f": {
      "title": "Anthropic raises $13B at $183B valuation",
      "publisher": "Axios",
      "url": "https://www.axios.com/newsletters/axios-pro-rata-63356c31-fad6-47ec-a239-c9da00e0a78f",
      "publishedAt": "2025-09-03",
      "accessedAt": "2026-07-19",
      "type": "news"
    },
    "anthropic-2026-series-g": {
      "title": "Anthropic raises $30B at $380B valuation",
      "publisher": "Reuters",
      "url": "https://www.investing.com/news/economy-news/anthropic-valued-at-380-billion-in-latest-funding-round-4503855",
      "publishedAt": "2026-02-12",
      "accessedAt": "2026-07-19",
      "type": "news"
    },
    "anthropic-2026-series-h": {
      "title": "Anthropic raises $65B at $965B post-money valuation",
      "publisher": "Anthropic / Reuters",
      "url": "https://www.anthropic.com/news/series-h",
      "publishedAt": "2026-05-28",
      "accessedAt": "2026-07-19",
      "type": "company"
    }
  },
  "insights": {
    "thinking.formation": {
      "labId": "thinking",
      "kind": "formation",
      "field": "formation.year"
    },
    "thinking.funding.2025-seed": {
      "labId": "thinking",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "thinking-2025-seed"
    },
    "thinking.disclosure": {
      "labId": "thinking",
      "kind": "analyst-assessment",
      "field": "disclosureConfidence"
    },
    "thinking.thesis": {
      "labId": "thinking",
      "kind": "thesis",
      "field": "note"
    },
    "ssi.formation": {
      "labId": "ssi",
      "kind": "formation",
      "field": "formation.year"
    },
    "ssi.funding.2024-seed": {
      "labId": "ssi",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "ssi-2024-seed"
    },
    "ssi.funding.2025-round": {
      "labId": "ssi",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "ssi-2025-round"
    },
    "ssi.disclosure": {
      "labId": "ssi",
      "kind": "analyst-assessment",
      "field": "disclosureConfidence"
    },
    "ssi.thesis": {
      "labId": "ssi",
      "kind": "thesis",
      "field": "note"
    },
    "ineffable.formation": {
      "labId": "ineffable",
      "kind": "formation",
      "field": "formation.year"
    },
    "ineffable.funding.2026-seed": {
      "labId": "ineffable",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "ineffable-2026-seed"
    },
    "ineffable.disclosure": {
      "labId": "ineffable",
      "kind": "analyst-assessment",
      "field": "disclosureConfidence"
    },
    "ineffable.thesis": {
      "labId": "ineffable",
      "kind": "thesis",
      "field": "note"
    },
    "recursive.formation": {
      "labId": "recursive",
      "kind": "formation",
      "field": "formation.year"
    },
    "recursive.funding.2026-round": {
      "labId": "recursive",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "recursive-2026-round"
    },
    "recursive.disclosure": {
      "labId": "recursive",
      "kind": "analyst-assessment",
      "field": "disclosureConfidence"
    },
    "recursive.thesis": {
      "labId": "recursive",
      "kind": "thesis",
      "field": "note"
    },
    "sakana.formation": {
      "labId": "sakana",
      "kind": "formation",
      "field": "formation.year"
    },
    "sakana.funding.2024-series-a": {
      "labId": "sakana",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "sakana-2024-series-a"
    },
    "sakana.funding.2025-series-b": {
      "labId": "sakana",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "sakana-2025-series-b"
    },
    "sakana.disclosure": {
      "labId": "sakana",
      "kind": "analyst-assessment",
      "field": "disclosureConfidence"
    },
    "sakana.thesis": {
      "labId": "sakana",
      "kind": "thesis",
      "field": "note"
    },
    "liquid.formation": {
      "labId": "liquid",
      "kind": "formation",
      "field": "formation.year"
    },
    "liquid.funding.2023-seed": {
      "labId": "liquid",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "liquid-2023-seed"
    },
    "liquid.funding.2024-series-a": {
      "labId": "liquid",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "liquid-2024-series-a"
    },
    "liquid.disclosure": {
      "labId": "liquid",
      "kind": "analyst-assessment",
      "field": "disclosureConfidence"
    },
    "liquid.thesis": {
      "labId": "liquid",
      "kind": "thesis",
      "field": "note"
    },
    "ndea.formation": {
      "labId": "ndea",
      "kind": "formation",
      "field": "formation.year"
    },
    "ndea.funding.2025-launch": {
      "labId": "ndea",
      "kind": "funding-status",
      "field": "fundingHistory",
      "recordId": "ndea-2025-launch"
    },
    "ndea.disclosure": {
      "labId": "ndea",
      "kind": "analyst-assessment",
      "field": "disclosureConfidence"
    },
    "ndea.thesis": {
      "labId": "ndea",
      "kind": "thesis",
      "field": "note"
    },
    "ami.formation": {
      "labId": "ami",
      "kind": "formation",
      "field": "formation.year"
    },
    "ami.funding.2026-seed": {
      "labId": "ami",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "ami-2026-seed"
    },
    "ami.disclosure": {
      "labId": "ami",
      "kind": "analyst-assessment",
      "field": "disclosureConfidence"
    },
    "ami.thesis": {
      "labId": "ami",
      "kind": "thesis",
      "field": "note"
    },
    "worldlabs.formation": {
      "labId": "worldlabs",
      "kind": "formation",
      "field": "formation.year"
    },
    "worldlabs.funding.2024-early": {
      "labId": "worldlabs",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "worldlabs-2024-early"
    },
    "worldlabs.funding.2026-round": {
      "labId": "worldlabs",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "worldlabs-2026-round"
    },
    "worldlabs.disclosure": {
      "labId": "worldlabs",
      "kind": "analyst-assessment",
      "field": "disclosureConfidence"
    },
    "worldlabs.thesis": {
      "labId": "worldlabs",
      "kind": "thesis",
      "field": "note"
    },
    "inception.formation": {
      "labId": "inception",
      "kind": "formation",
      "field": "formation.year"
    },
    "inception.funding.2025-seed": {
      "labId": "inception",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "inception-2025-seed"
    },
    "inception.disclosure": {
      "labId": "inception",
      "kind": "analyst-assessment",
      "field": "disclosureConfidence"
    },
    "inception.thesis": {
      "labId": "inception",
      "kind": "thesis",
      "field": "note"
    },
    "openai.formation": {
      "labId": "openai",
      "kind": "formation",
      "field": "formation.year"
    },
    "openai.funding.2023-secondary": {
      "labId": "openai",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "openai-2023-secondary"
    },
    "openai.funding.2024-round": {
      "labId": "openai",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "openai-2024-round"
    },
    "openai.funding.2025-round": {
      "labId": "openai",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "openai-2025-round"
    },
    "openai.funding.2026-round": {
      "labId": "openai",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "openai-2026-round"
    },
    "openai.disclosure": {
      "labId": "openai",
      "kind": "analyst-assessment",
      "field": "disclosureConfidence"
    },
    "openai.thesis": {
      "labId": "openai",
      "kind": "thesis",
      "field": "note"
    },
    "anthropic.formation": {
      "labId": "anthropic",
      "kind": "formation",
      "field": "formation.year"
    },
    "anthropic.funding.2023-series-c": {
      "labId": "anthropic",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "anthropic-2023-series-c"
    },
    "anthropic.funding.2024-series-d": {
      "labId": "anthropic",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "anthropic-2024-series-d"
    },
    "anthropic.funding.2025-series-e": {
      "labId": "anthropic",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "anthropic-2025-series-e"
    },
    "anthropic.funding.2025-series-f": {
      "labId": "anthropic",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "anthropic-2025-series-f"
    },
    "anthropic.funding.2026-series-g": {
      "labId": "anthropic",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "anthropic-2026-series-g"
    },
    "anthropic.funding.2026-series-h": {
      "labId": "anthropic",
      "kind": "funding",
      "field": "fundingHistory",
      "recordId": "anthropic-2026-series-h"
    },
    "anthropic.disclosure": {
      "labId": "anthropic",
      "kind": "analyst-assessment",
      "field": "disclosureConfidence"
    },
    "anthropic.thesis": {
      "labId": "anthropic",
      "kind": "thesis",
      "field": "note"
    }
  },
  "evidenceLinks": [
    {
      "sourceId": "thinking-reuters-2025",
      "insightId": "thinking.formation",
      "relationship": "supports"
    },
    {
      "sourceId": "thinking-reuters-2025",
      "insightId": "thinking.funding.2025-seed",
      "relationship": "supports"
    },
    {
      "sourceId": "thinking-official",
      "insightId": "thinking.thesis",
      "relationship": "supports"
    },
    {
      "sourceId": "thinking-official",
      "insightId": "thinking.disclosure",
      "relationship": "context"
    },
    {
      "sourceId": "ssi-official",
      "insightId": "ssi.formation",
      "relationship": "supports"
    },
    {
      "sourceId": "ssi-reuters-2024",
      "insightId": "ssi.funding.2024-seed",
      "relationship": "supports"
    },
    {
      "sourceId": "ssi-techcrunch-2025",
      "insightId": "ssi.funding.2025-round",
      "relationship": "supports"
    },
    {
      "sourceId": "ssi-official",
      "insightId": "ssi.thesis",
      "relationship": "supports"
    },
    {
      "sourceId": "ssi-official",
      "insightId": "ssi.disclosure",
      "relationship": "context"
    },
    {
      "sourceId": "ineffable-techcrunch-2026",
      "insightId": "ineffable.formation",
      "relationship": "supports"
    },
    {
      "sourceId": "ineffable-techcrunch-2026",
      "insightId": "ineffable.funding.2026-seed",
      "relationship": "supports"
    },
    {
      "sourceId": "ineffable-official",
      "insightId": "ineffable.thesis",
      "relationship": "supports"
    },
    {
      "sourceId": "ineffable-official",
      "insightId": "ineffable.disclosure",
      "relationship": "context"
    },
    {
      "sourceId": "recursive-caplight",
      "insightId": "recursive.formation",
      "relationship": "supports"
    },
    {
      "sourceId": "recursive-axios-2026",
      "insightId": "recursive.funding.2026-round",
      "relationship": "supports"
    },
    {
      "sourceId": "recursive-official",
      "insightId": "recursive.thesis",
      "relationship": "supports"
    },
    {
      "sourceId": "recursive-official",
      "insightId": "recursive.disclosure",
      "relationship": "context"
    },
    {
      "sourceId": "sakana-company",
      "insightId": "sakana.formation",
      "relationship": "supports"
    },
    {
      "sourceId": "sakana-series-a",
      "insightId": "sakana.funding.2024-series-a",
      "relationship": "supports"
    },
    {
      "sourceId": "sakana-jetro-2024",
      "insightId": "sakana.funding.2024-series-a",
      "relationship": "supports"
    },
    {
      "sourceId": "sakana-series-b",
      "insightId": "sakana.funding.2025-series-b",
      "relationship": "supports"
    },
    {
      "sourceId": "sakana-company",
      "insightId": "sakana.thesis",
      "relationship": "supports"
    },
    {
      "sourceId": "sakana-company",
      "insightId": "sakana.disclosure",
      "relationship": "context"
    },
    {
      "sourceId": "liquid-launch",
      "insightId": "liquid.formation",
      "relationship": "supports"
    },
    {
      "sourceId": "liquid-techcrunch-2023",
      "insightId": "liquid.funding.2023-seed",
      "relationship": "supports"
    },
    {
      "sourceId": "liquid-series-a",
      "insightId": "liquid.funding.2024-series-a",
      "relationship": "supports"
    },
    {
      "sourceId": "liquid-bloomberg-2024",
      "insightId": "liquid.funding.2024-series-a",
      "relationship": "supports"
    },
    {
      "sourceId": "liquid-launch",
      "insightId": "liquid.thesis",
      "relationship": "supports"
    },
    {
      "sourceId": "liquid-launch",
      "insightId": "liquid.disclosure",
      "relationship": "context"
    },
    {
      "sourceId": "ndea-yc",
      "insightId": "ndea.formation",
      "relationship": "supports"
    },
    {
      "sourceId": "ndea-techcrunch-2025",
      "insightId": "ndea.funding.2025-launch",
      "relationship": "supports"
    },
    {
      "sourceId": "ndea-about",
      "insightId": "ndea.thesis",
      "relationship": "supports"
    },
    {
      "sourceId": "ndea-about",
      "insightId": "ndea.disclosure",
      "relationship": "context"
    },
    {
      "sourceId": "ami-reuters-2026",
      "insightId": "ami.formation",
      "relationship": "supports"
    },
    {
      "sourceId": "ami-reuters-2026",
      "insightId": "ami.funding.2026-seed",
      "relationship": "supports"
    },
    {
      "sourceId": "ami-official",
      "insightId": "ami.thesis",
      "relationship": "supports"
    },
    {
      "sourceId": "ami-official",
      "insightId": "ami.disclosure",
      "relationship": "context"
    },
    {
      "sourceId": "world-techcrunch-2024",
      "insightId": "worldlabs.formation",
      "relationship": "supports"
    },
    {
      "sourceId": "world-techcrunch-2024",
      "insightId": "worldlabs.funding.2024-early",
      "relationship": "supports"
    },
    {
      "sourceId": "world-funding-2026",
      "insightId": "worldlabs.funding.2026-round",
      "relationship": "supports"
    },
    {
      "sourceId": "world-reuters-2026",
      "insightId": "worldlabs.funding.2026-round",
      "relationship": "context"
    },
    {
      "sourceId": "world-official",
      "insightId": "worldlabs.thesis",
      "relationship": "supports"
    },
    {
      "sourceId": "world-official",
      "insightId": "worldlabs.disclosure",
      "relationship": "context"
    },
    {
      "sourceId": "inception-cbinsights",
      "insightId": "inception.formation",
      "relationship": "supports"
    },
    {
      "sourceId": "inception-techcrunch-2025",
      "insightId": "inception.funding.2025-seed",
      "relationship": "supports"
    },
    {
      "sourceId": "inception-about",
      "insightId": "inception.thesis",
      "relationship": "supports"
    },
    {
      "sourceId": "inception-about",
      "insightId": "inception.disclosure",
      "relationship": "context"
    },
    {
      "sourceId": "openai-official",
      "insightId": "openai.formation",
      "relationship": "supports"
    },
    {
      "sourceId": "openai-2023-techcrunch",
      "insightId": "openai.funding.2023-secondary",
      "relationship": "supports"
    },
    {
      "sourceId": "openai-2024-reuters",
      "insightId": "openai.funding.2024-round",
      "relationship": "supports"
    },
    {
      "sourceId": "openai-2025-reuters",
      "insightId": "openai.funding.2025-round",
      "relationship": "supports"
    },
    {
      "sourceId": "openai-2026-reuters",
      "insightId": "openai.funding.2026-round",
      "relationship": "supports"
    },
    {
      "sourceId": "openai-official",
      "insightId": "openai.thesis",
      "relationship": "supports"
    },
    {
      "sourceId": "openai-official",
      "insightId": "openai.disclosure",
      "relationship": "context"
    },
    {
      "sourceId": "anthropic-official",
      "insightId": "anthropic.formation",
      "relationship": "supports"
    },
    {
      "sourceId": "anthropic-2023-information",
      "insightId": "anthropic.funding.2023-series-c",
      "relationship": "supports"
    },
    {
      "sourceId": "anthropic-2024-stockanalysis",
      "insightId": "anthropic.funding.2024-series-d",
      "relationship": "supports"
    },
    {
      "sourceId": "anthropic-2025-series-e",
      "insightId": "anthropic.funding.2025-series-e",
      "relationship": "supports"
    },
    {
      "sourceId": "anthropic-2025-series-f",
      "insightId": "anthropic.funding.2025-series-f",
      "relationship": "supports"
    },
    {
      "sourceId": "anthropic-2026-series-g",
      "insightId": "anthropic.funding.2026-series-g",
      "relationship": "supports"
    },
    {
      "sourceId": "anthropic-2026-series-h",
      "insightId": "anthropic.funding.2026-series-h",
      "relationship": "supports"
    },
    {
      "sourceId": "anthropic-official",
      "insightId": "anthropic.thesis",
      "relationship": "supports"
    },
    {
      "sourceId": "anthropic-official",
      "insightId": "anthropic.disclosure",
      "relationship": "context"
    }
  ]
});
