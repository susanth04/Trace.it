const { expect } = require("chai");

describe("FundTracker", function () {
  it("Should create a new project", async function () {
    const FundTracker = await ethers.getContractFactory("FundTracker");
    const fundTracker = await FundTracker.deploy();
    await fundTracker.deployed();

    const tx = await fundTracker.createProject(
      "Test Project",
      "Description",
      ethers.utils.parseEther("10"),
      "0xYourWalletAddress"
    );

    const projects = await fundTracker.getProjects();
    expect(projects.length).to.equal(1);
  });
});
