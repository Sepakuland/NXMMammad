import React from 'react'
import AccountReviewPrint_Level1 from './levels/level1/AccountReviewPrint_Level1'
import AccountReviewPrint_Level2 from './levels/level2/AccountReviewPrint_Level2'
import AccountingReviewPrint_Level3 from './levels/level3/AccountingReviewPrint_Level3'
import AccountingReviewPrint_Level4 from './levels/level4/AccountingReviewPrint_Level4'
import AccountingReviewPrint_Level5 from './levels/level5/AccountingReviewPrint_Level5'
import AccountingReviewPrint_Level6 from './levels/level6/AccountingReviewPrint_Level6'
import AccountingReviewPrint_Level7 from './levels/level7/AccountingReviewPrint_Level7'
import AccountingReviewPrint_Level8 from './levels/level8/AccountingReviewPrint_Level8'
import AccountingReviewPrint_Level9 from './levels/level9/AccountingReviewPrint_Level9'
import AccountingReviewPrint_Level10 from './levels/level10/AccountingReviewPrint_Level10'
import AccountingReviewPrint_Level11 from './levels/level11/AccountingReviewPrint_Level11'
import AccountingReviewPrint_Level12 from './levels/level12/AccountingReviewPrint_Level12'
import AccountCirculationPrint from './AccountCirculation/AccountCirculationPrint'
import ReviewDocumentPrint from './ReviewDocument/ReviewDocumentPrint'



const AccountReviewPrint = () => {
  const tempIndex = JSON.parse(localStorage.getItem(`tempIndex`))
  const indexRef = JSON.parse(localStorage.getItem(`indexRef`))


  return (
    <>
      {
        (tempIndex[indexRef]?.type == 'R' && tempIndex[indexRef]?.level == 1) ?
          <AccountReviewPrint_Level1 /> :
          (tempIndex[indexRef]?.type == 'R' && tempIndex[indexRef]?.level == 2) ?
            <AccountReviewPrint_Level2 /> :
            (tempIndex[indexRef]?.type == 'R' && tempIndex[indexRef]?.level == 3) ?
              <AccountingReviewPrint_Level3 /> :
              (tempIndex[indexRef]?.type == 'R' && tempIndex[indexRef]?.level == 4) ?
                <AccountingReviewPrint_Level4 /> :
                (tempIndex[indexRef]?.type == 'R' && tempIndex[indexRef]?.level == 5) ?
                  <AccountingReviewPrint_Level5 /> :
                  (tempIndex[indexRef]?.type == 'R' && tempIndex[indexRef]?.level == 6) ?
                    <AccountingReviewPrint_Level6 /> :
                    (tempIndex[indexRef]?.type == 'R' && tempIndex[indexRef]?.level == 7) ?
                      <AccountingReviewPrint_Level7 /> :
                      (tempIndex[indexRef]?.type == 'R' && tempIndex[indexRef]?.level == 8) ?
                        <AccountingReviewPrint_Level8 /> :
                        (tempIndex[indexRef]?.type == 'R' && tempIndex[indexRef]?.level == 9) ?
                          <AccountingReviewPrint_Level9 /> :
                          (tempIndex[indexRef]?.type == 'R' && tempIndex[indexRef]?.level == 10) ?
                            <AccountingReviewPrint_Level10 /> :
                            (tempIndex[indexRef]?.type == 'R' && tempIndex[indexRef]?.level == 11) ?
                              <AccountingReviewPrint_Level11 /> :
                              (tempIndex[indexRef]?.type == 'R' && tempIndex[indexRef]?.level == 12) ?
                                < AccountingReviewPrint_Level12 /> :
                                tempIndex[indexRef]?.type == 'C' ?
                                  <AccountCirculationPrint /> : 
                                  <ReviewDocumentPrint/>

      }
    </>
  )
}
export default AccountReviewPrint









