import { ethers } from "hardhat";

async function main() {
  const StudentSocietyDAO = await ethers.getContractFactory("StudentSocietyDAO");
  const studentSocietyDAO = await StudentSocietyDAO.deploy();
  await studentSocietyDAO.deployed();

  console.log(`dAO deployed to ${studentSocietyDAO.address}`);

  const erc20 = await studentSocietyDAO.studentERC20()
  console.log(`erc20 deployed to ${erc20}`)

  const erc721 = await studentSocietyDAO.studentERC721()
  console.log(`erc721 deployed to ${erc721}`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
