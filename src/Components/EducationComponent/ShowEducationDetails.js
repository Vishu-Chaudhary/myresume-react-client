import React, { Component } from 'react';
import classes from './EducationComponent.css'
import commonClasses from '../common/common.css'
import {
    CGPA10,
    CGPA5,
    PERCENT,
    SECONDARY_EDUCATION,
    SENIOR_SECONDARY_EDUCATION,
    DIPLOMA,
    GRADUATION,
    POST_GRADUATION,
} from '../Constants/index';
import { updateEducationDetails } from '../Utils/ApiUtils';
class ShowEduDetails extends Component {
    state = {
        board: {
            value: '',
        },
        degree: {
            value: '',
        },
        institution: {
            value: '',
        },
        performance: {
            value: '',
        },
        performanceScale: {
            value: '',
        },
        stream: {
            value: '',
        },
        yearOfCompletion: {
            value: '',
        }

    }

    handleEditDetails = (event, education) => {
        document.getElementById("editForm").focus();
        this.setState(prevState => ({
            showEditDetails: !prevState.showEditDetails,
            showEditDetailsId: education.id,
            board: {
                value: education.board,
            },
            educationType: {
                value: education.educationType
            },
            id:
            {
                value: education.id
            },
            degree: {
                value: education.degree,
            },
            institution: {
                value: education.institution,
            },
            performance: {
                value: education.performance,
            },
            performanceScale: {
                value: education.performanceScale,
            },
            stream: {
                value: education.stream,
            },
            yearOfCompletion: {
                value: education.yearOfCompletion,
            }
        }))
    }
    isScaleNotSelected = () => {
        const scale = this.state.performanceScale.value;
        if (scale.length > 0 && [CGPA10, CGPA5, PERCENT].includes(scale)) {
            return false;
        }
        return true;
    }
    handleSubmit = (event) => {
        event.preventDefault();
        const eduDetails = {
            id:this.state.id.value,
            board: this.state.board.value,
            degree: this.state.degree.value,
            institution: this.state.institution.value,
            performanceScale: this.state.performanceScale.value,
            performance: this.state.performance.value,
            educationType: this.state.educationType.value,
            stream: this.state.stream.value,
            yearOfCompletion: this.state.yearOfCompletion.value
        }
        console.log(eduDetails)
        updateEducationDetails(eduDetails)
            .then(response => {
               
                this.handleEditDetails(event, eduDetails)
                this.props.action();
            })

    }
    handleChange = (event, validation) => {
        const targetValue = event.target.value
        const targetName = event.target.name
        if (!validation)
            this.setState({
                [targetName]: {
                    value: targetValue,
                }

            })
        else {
            this.setState({
                [targetName]: {
                    value: targetValue,
                    ...validation(targetValue)
                },

            })
        }
    }

    setEditDetails = (id) => {
        this.props.eduDetail.forEach(education => {
            if (education.id === id) {
                this.setState({
                    board: {
                        value: education.board
                    }
                })

            }
        });
        return true;

    }



    render() {
        return (
            <div>
                {
                    this.props.eduDetail &&
                    this.props.eduDetail.map((details) => {
                        return (
                            <div className={classes.eduFlexBody} key={details.id} id="editForm">
                                <div className={classes.detailHeading}>
                                    {(details.educationType === GRADUATION || details.educationType === POST_GRADUATION) &&
                                        <p><strong>{details.degree} {details.stream}</strong></p>
                                    }
                                    {(details.educationType !== GRADUATION && details.educationType !== POST_GRADUATION) &&
                                        <p><strong>{details.educationType} {details.stream}</strong></p>
                                    } <div className={classes.details}>

                                        <p>{details.board}<span> ( {details.institution} )</span></p>
                                        <p>Year Of Completion:{details.yearOfCompletion}</p>
                                        {details.performanceScale === CGPA10 &&
                                            <p>CGPA : {details.performance}/10</p>
                                        }
                                        {details.performanceScale === CGPA5 &&
                                            <p>CGPA : {details.performance}/10</p>
                                        }
                                        {details.performanceScale === PERCENT &&
                                            <p>Percentage : {details.performance}%</p>
                                        }

                                    </div>
                                </div>
                                <div className={classes.editEduDetailsIcons} >
                                    <i className={"fas fa-edit " + classes.editIcon} onClick={(event) => this.handleEditDetails(event, details)}></i>
                                    <i className="far fa-trash-alt"></i>
                                </div>
                                {
                                    details.id === this.state.showEditDetailsId &&
                                    this.state.showEditDetails &&
                                    <div className={classes.modal} >
                                        <div className={classes.modal_content} ref={edit => { this.edit = edit; }}>
                                            {console.log(this.state.board.value)}

                                            <form onSubmit={this.handleSubmit} className={classes.formBox}>
                                                {
                                                    (
                                                        this.state.educationType.value === SECONDARY_EDUCATION ||
                                                        this.state.educationType.value === SENIOR_SECONDARY_EDUCATION
                                                    ) &&
                                                    <label className={commonClasses.label + " " + classes.modal_label}>
                                                        Board:
                                                        <input type="text" name='board' placeholder='CBSE, ICSE, NIOS etc..' value={this.state.board.value} required onChange={(event) => this.handleChange(event, this.validateBoard)}
                                                        />
                                                        <i>{this.state.board.errorMessage}</i>
                                                    </label>
                                                }

                                                {
                                                    (
                                                        this.state.educationType.value !== DIPLOMA &&
                                                        this.state.educationType.value !== SECONDARY_EDUCATION &&
                                                        this.state.educationType.value !== SENIOR_SECONDARY_EDUCATION
                                                    ) &&
                                                    <label className={commonClasses.label + " " + classes.modal_label}>
                                                        Degree:
                                                        <input type="text" name='degree' placeholder='Btech BCA MA etc..' value={this.state.degree.value} onChange={(event) => this.handleChange(event, this.validateDegree)}
                                                        />
                                                        <i>{this.state.degree.errorMessage}</i>
                                                    </label>
                                                }
                                                <label className={commonClasses.label + " " + classes.modal_label}>
                                                    Institute:
                                                    <input type="text" name='institute' placeholder='DPS, DU, IPU etc..' value={this.state.institution.value} onChange={(event) => this.handleChange(event, this.validateInstitute)}
                                                    />
                                                    <i>{this.state.institution.errorMessage}</i>
                                                </label>

                                                <label className={commonClasses.label + " " + classes.modal_label}>
                                                    Performance Scale:
                                                    <select value={this.state.performanceScale.value} onChange={(event)=>this.handleChange(event , this.validatePerformance)} name="performanceScale">
                                                        <option value="" selected disabled hidden>Choose a scale..</option>
                                                        <option value={CGPA5}>CGPA out of 5</option>
                                                        <option value={CGPA10}>CGPA out of 10</option>
                                                        <option value={PERCENT}>Percentage%</option>
                                                    </select>
                                                </label>

                                                <label className={commonClasses.label + " " + classes.modal_label}>
                                                    Performance:
                                                    <input type="number" name='performance' placeholder='78, 9, 4 etc..' value={this.state.performance.value}
                                                        disabled={this.isScaleNotSelected()}
                                                        onChange={(event) => this.handleChange(event, this.validatePerformance)} />
                                                    <i>{this.state.performance.errorMessage}</i>
                                                </label>
                                                {this.state.educationType.value !== SECONDARY_EDUCATION &&
                                                    <label className={commonClasses.label + " " + classes.modal_label}>
                                                        Stream:
                                                        <input type="text" placeholder="PCM, Commerce, Arts etc.." name='stream' value={this.state.stream.value} onChange={(event) => this.handleChange(event)} />
                                                        <i>{this.state.stream.errorMessage}</i>
                                                    </label>}
                                                <label className={commonClasses.label + " " + classes.modal_label}>
                                                    Year of Completion:
                                                     <input type="number" value={this.state.yearOfCompletion.value} min="1900" max="2099" step="1" name="yearOfCompletion" onChange={(event) => this.handleChange(event)} />
                                                    <i>{this.state.yearOfCompletion.errorMessage}</i>
                                                </label>


                                                <button className={classes.cancelbtn} onClick={(event) => this.handleEditDetails(event, details)}> Cancel</button>
                                                <button type="submit" className={classes.buttonSave}>Save</button>
                                            </form>
                                        </div>
                                    </div>
                                }
                            </div>


                        )
                    })

                }
            </div>

        )
    }
    validateBoard = (board) => {
        const boardREGEX = RegExp('^[a-zA-Z]+[ A-Za-z]*$');
        if (!boardREGEX.test(board)) {
            return {
                validationStatus: 'error',
                errorMessage: 'Please enter albhabets only and leading spaces are not allowed',
            }

        }

        return {
            validationStatus: 'success',
        }


    }

    validateDegree = (degree) => {
        const degreeREGEX = RegExp('^[a-zA-Z]+[a-zA-Z ]*$');
        if (!degreeREGEX.test(degree)) {
            return {
                validationStatus: 'error',
                errorMessage: 'Please enter albhabets only and leading spaces are not allowed',
            }

        }
        else {
            return {
                validationStatus: 'success',
                errorMessage: '',
            }
        }

    }
    validateInstitute = (institute) => {
        const instituteREGEX = RegExp('^[a-zA-Z]+[a-zA-Z ]*$');
        if (!instituteREGEX.test(institute)) {
            return {
                validationStatus: 'error',
                errorMessage: 'Please enter albhabets only and leading spaces are not allowed',
            }

        }
        else {
            return {
                validationStatus: 'success',
                errorMessage: '',
            }
        }

    }

    validatePerformance = (performance) => {
        const scaleREGEX = RegExp('^[0-9]*(?!-).?[0-9]{1,2}$');
        if (!scaleREGEX.test(performance)) {

            return {
                validationStatus: 'error',
                errorMessage: 'Please enter in format: 1, 1.5 , 99.87 etc.!',
            }
        }
        performance = parseFloat(performance)
        if (this.state.performanceScale.value === CGPA5 && (performance > 5 || performance < 0)) {

            return {
                validationStatus: 'error',
                errorMessage: 'Please enter value between 0-5 only!',

            }

        }

        else if (this.state.performanceScale.value === CGPA10 && (performance > 10 || performance < 0)) {
            return {
                validationStatus: 'error',
                errorMessage: 'Please enter value between 0-10 only!',

            }

        }

        else if (this.state.performanceScale.value === PERCENT && (performance > 100 || performance < 0)) {
            return {
                validationStatus: 'error',
                errorMessage: 'Please enter value between 0-100 only!',

            }

        }
        else {

            return {
                validationStatus: 'success',
                ErrorMessage: '',
            }

        }

    }
    validateStream = (stream) => {
        const streamREGEX = RegExp('^[a-zA-Z]+[a-zA-Z ]*$');
        if (!streamREGEX.test(stream)) {
            return {
                validationStatus: 'error',
                errorMessage: 'Please enter albhabets only and leading spaces are not allowed',
            }

        }

        return {
            validationStatus: 'success',
        }


    }
    validateYearOfCompletion = (yearOfCompletion) => {
        const yearOfCompletionREGEX = RegExp('^[0-9]{4}$')
        if (!yearOfCompletionREGEX.test(yearOfCompletion)) {
            return {
                validationStatus: 'error',
                errorMessage: 'Please enter 4 digits numeric value only!',
            }

        }

        return {
            validationStatus: 'success',
        }

    }


}
export default ShowEduDetails;