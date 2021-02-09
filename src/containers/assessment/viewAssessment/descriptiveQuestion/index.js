import React from 'react';
import '../viewAssessment.css';
import { TextareaAutosize } from '@material-ui/core';

const DescriptiveQuestion = () => {
  return (
    <div>
      <div className='question-header'>
        Description specific to this test to be followed by all appearing students/pupils
        / attendees (Write if req. else leave empty)
      </div>
      <div className='question-numbers'>
        <div>Q1</div>
        <div>Progress - 1/20</div>
      </div>
      <div className='mcq-question-wrapper'>
        <p>
          The oldest classical Greek and Latin writing had little or no space between
          words and could be written in boustrophedon (alternating directions). Over time,
          text direction (left to right) became standardized, and word dividers and
          terminal punctuation became common. The first way to divide sentences into
          groups was the original parágraphos, similar to an underscore at the beginning
          of the new group.[2] The Greek parágraphos evolved into the pilcrow (¶), which
          in English manuscripts in the Middle Ages can be seen inserted inline between
          sentences. The hedera leaf (e.g. ☙) has also been used in the same way. In
          ancient manuscripts, another means to divide sentences into paragraphs was a
          line break (newline) followed by an initial at the beginning of the next
          paragraph. An initial is an oversized capital letter, sometimes outdented beyond
          the margin of the text. This style can be seen, for example, in the original Old
          English manuscript of Beowulf. Outdenting is still used in English typography,
          though not commonly.[3] Modern English typography usually indicates a new
          paragraph by indenting the first line. This style can be seen in the
          (handwritten) United States Constitution from 1787. For additional
          ornamentation, a hedera leaf or other symbol can be added to the inter-paragraph
          white space, or put in the indentation space.
        </p>
        <h3>Question about the passage</h3>
        {/* <img src='https://via.placeholder.com/150' alt='question image' /> */}
        <TextareaAutosize
          rowsMax={100}
          style={{ width: '100%', minHeight: '300px' }}
          aria-label='maximum height'
          placeholder='Maximum 4 rows'
          defaultValue='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                ut labore et dolore magna aliqua.'
        />
        <div className='question-submit-btn'>Next</div>
      </div>
    </div>
  );
};

export default DescriptiveQuestion;
