import { Button, Image, Input, List } from 'antd';
import { Header } from "../../asset";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from 'react';
import { daoContract, myERC20Contract, web3, myERC721Contract } from "../../utils/contracts";
import './index.css';
import { workerData } from 'worker_threads';
import moment, { Moment } from 'moment'
const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

const LotteryPage = () => {
    var proposalEnd: string
    const [account, setAccount] = useState('')
    const [accountBalance, setAccountBalance] = useState(0)
    const [awardBalance, setAwardBalance] = useState(0)
    const [voteAmount, setVoteAmount] = useState(0)
    const [countProposal, setCountProposal] = useState(0)
    const [createAmount, setCreateAmount] = useState(0)
    const [proposalName, setProposalName] = useState(0)
    const [proposalIndex, setProposalIndex] = useState(0)
    const [passCount, setPassCount] = useState(0)
    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const { ethereum } = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if (accounts && accounts.length) {
                    setAccount(accounts[0])
                }
            }
        }

        initCheckAccounts()
    }, [])

    useEffect(() => {
        const getDaoContractInfo = async () => {
            if (daoContract) {
                const ca = await daoContract.methods.CREATE_AMOUNT().call()
                setCreateAmount(ca)
                const va = await daoContract.methods.VOTE_AMOUNT().call()
                setVoteAmount(va)
                const cp = await daoContract.methods.countProposal().call()
                setCountProposal(cp)
                const p = await daoContract.methods.fPassCount(account).call()
                setPassCount(p)
            } else {
                alert('Contract not exists.')
            }
        }
        getDaoContractInfo()
    }, [])
    useEffect(() => {
        const getAccountInfo = async () => {
            if (myERC20Contract) {
                const ab = await myERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
                const awb = await myERC721Contract.methods.balanceOf(account).call()
                setAwardBalance(awb)
                const p = await daoContract.methods.fPassCount(account).call()
                setPassCount(p)
            } else {
                alert('Contract not exists.')
            }
        }

        if (account !== '') {
            getAccountInfo()
        }
    }, [account])
    const award = async () => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (daoContract && myERC721Contract) {
            try {
                if (passCount >= 3) {
                    try {
                        await myERC721Contract.methods.awardPlayer().send({
                            from: account
                        })
                        alert('Your proposal has passed three.')
                    } catch (error: any) {
                        alert(error.message)
                    }
                }
                else
                alert('Your proposal has not passed enough.')
            }
            catch (error: any) {
                alert(error.message)
            }
        }
        else {
            alert('Contract not exists.')
        }
    }

    const getProposalInfo = async () => {
        if (daoContract) {
            var i = 0
            for (; i < countProposal; i++) {
                var et = await daoContract.methods.endTime(i).call()
                var p = await daoContract.methods.ifPass(i).call()
                if (et < Date.parse(moment().format('YYYY-MM-DD HH:mm:ss')) && p == false) {
                    try {
                        await myERC20Contract.methods.approve(daoContract.options.address, 10).send({ from: account })
                        await daoContract.methods.expire(i).send({ from: account })
                    } catch (error: any) {
                        alert(error.message)
                    }
                }
            }
        } else {
            alert('Contract not exists.')
        }
    }
    const onClaimTokenAirdrop = async () => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (myERC20Contract) {
            try {
                await myERC20Contract.methods.airdrop().send({
                    from: account
                })
                alert('You have claimed ZJU Token.')
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }
    const onChangeName = (e: any) => {
        setProposalName(e.target.value)
    }
    const onChangeEnd = (e: any) => {
        proposalEnd = e.target.value
    }
    const onChangeIndex = (e: any) => {
        setProposalIndex(e.target.value)
    }
    const onClickConnectWallet = async () => {
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        // @ts-ignore
        const { ethereum } = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }

        try {
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            if (ethereum.chainId !== GanacheTestChainId) {
                const chain = {
                    chainId: GanacheTestChainId, // Chain-ID
                    chainName: GanacheTestChainName, // Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: chain.chainId }] })
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code === 4902) {
                        await ethereum.request({
                            method: 'wallet_addEthereumChain', params: [chain]
                        });
                    }
                }
            }

            // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
            await ethereum.request({ method: 'eth_requestAccounts' });
            // 获取小狐狸拿到的授权用户列表
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
        } catch (error: any) {
            alert(error.message)
        }
    }

    const onCreateProposal = async () => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (daoContract && myERC20Contract) {
            try {
                await myERC20Contract.methods.approve(daoContract.options.address, createAmount).send({ from: account })

                await daoContract.methods.createProposal(Date.parse(proposalEnd), proposalName).send({
                    from: account
                })
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }
    const onVote = async () => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (daoContract && myERC20Contract) {
            try {
                await myERC20Contract.methods.approve(daoContract.options.address, voteAmount).send({ from: account })

                await daoContract.methods.vote(proposalIndex, Date.parse(moment().format('YYYY-MM-DD HH:mm:ss'))).send({
                    from: account
                })
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }
    const onAgainst = async () => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (daoContract && myERC20Contract) {
            try {
                await myERC20Contract.methods.approve(daoContract.options.address, voteAmount).send({ from: account })

                await daoContract.methods.voteAgainst(proposalIndex, Date.parse(moment().format('YYYY-MM-DD HH:mm:ss'))).send({
                    from: account
                })
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')

        }
    }
    return (
        <div>
            <div className='container_user'>
                <h1>用户</h1>
                <div>当前用户：{account === '' ? '无用户连接' : account}</div>

                <div className='account'>
                    {account === '' && <Button onClick={onClickConnectWallet}>连接钱包</Button>}
                    <Button onClick={onClaimTokenAirdrop}>领取空投</Button>
                    <div>当前用户拥有浙大币数量：{account === '' ? 0 : accountBalance}</div>
                    <div>当前用户通过的合约数：{passCount}</div>
                    <Button onClick={award}>领取纪念品</Button>
                    <div>{awardBalance == 0 ? "" : "您已经领取浙大纪念品"}</div>
                </div>
            </div>
            <div className='container_proposal_vote'>
                <h1>投票</h1>
                <div>提案序号</div>
                <input onChange={onChangeIndex}></input>
                <Button onClick={onVote}>赞成</Button>
                <Button onClick={onAgainst}>反对</Button>

            </div><div className='container_proposal_list'>

                <h1>提案列表</h1>
                <div>序号按照提交时间从0开始</div>
                <div>当前总提案数：{countProposal}</div>
                <div>点击"检查提案"按钮检查提案是否通过</div>
                <Button onClick={getProposalInfo}>检查提案</Button>
            </div>
            <div className='container_proposal_create'>
                <h1>创建提案</h1>
                <div>提案名字</div>
                <input onChange={onChangeName}></input>
                <div>结束时间</div>
                <input onChange={onChangeEnd}></input>
                <Button onClick={onCreateProposal}>创建提案</Button>
                <div>当前时间（按此格式输入时间）：</div>
                <div>{moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                <div>当前时间戳：</div>
                <div>{Date.parse(moment().format('YYYY-MM-DD HH:mm:ss'))}</div>
            </div>
        </div>

    )
}

export default LotteryPage